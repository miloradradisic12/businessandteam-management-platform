import {
  Component,
  ComponentFactory, ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  Output,
  NgZone,
  OnInit,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';

import * as wjcGridSheet from 'wijmo/wijmo.grid.sheet';
import { Workbook } from 'wijmo/wijmo.xlsx';

import { DataSvc } from './services/DataSvc';
import { ContextMenuComponent } from './sheet-context-menu/contextmenu.component';
import { BindingFlexSheetBaseComponent } from './flexsheet.base.component';
import ProjectAnswerModel from 'app/core/models/ProjectAnswerModel';
import { debounce } from 'rxjs/operator/debounce';

declare var Dropbox: any;
/**
 * Component example of use
 * <app-spreadsheet [projectId]="projectid" [questionId]="questionId" (forceSave)="onForceSave()"></app-spreadsheet>
 */
@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: [
    './wijmo.min.css',
    './wijmo.theme.office.min.css',
    './spreadsheet.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpreadsheetComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [ContextMenuComponent],
})
export class SpreadsheetComponent extends BindingFlexSheetBaseComponent implements OnInit, ControlValueAccessor {
  pageState: string;
  editedPage = false;
  formulasSelectClass = 'hide';
  content: any;

  @ViewChild('flexSheet') flexSheet: wjcGridSheet.FlexSheet;
  @ViewChild('dynamicContextMenuContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('sum') sumElement: ElementRef;
  componentRef: ComponentRef<any>;
  prev_selection: any = {
    _row: 0,
    _row2: 0,
    _col: 0,
    _col2: 0
  };

  /**
   * Get if spreadsheet is read only - View only mode
   * @param isReadOnly
   */
  @Input() isReadOnly?: boolean = false;

  /**
   * Get project id
   * @param projectId
   */
  @Input() projectId?: number;
  /**
   * Get question id
   * @param questionId
   */
  @Input() questionId?: number;
  /**
   * Emitter that trigger after some spreadsheet event interaction
   * @param forceSave
   */
  @Output() forceSave = new EventEmitter();

  undo() {
    this.flexSheet.undo();
  }
  redo() {
    this.flexSheet.redo();
  }

  flexSheetInit(flexSheet: wjcGridSheet.FlexSheet) {
    const self = this;
    super.flexSheetInit(flexSheet);

    // Resize 'ok' btn on the top-right
    this.resizeFormulasBarBtn();

    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    flexSheet.isTabHolderVisible = true;
    flexSheet.showFilterIcons = true;
    flexSheet.showSort = true;
    flexSheet.allowSorting = true;

    if (this.isReadOnly == true) {
      flexSheet.hostElement.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, true);
    }

    // flexSheet.showFunctionList()

    flexSheet.prepareCellForEdit.addHandler((event) => {
      this.removeComponent();
      this.editedPage = true;
      this.prev_selection = flexSheet.selection;
      const cell_width = flexSheet.getCellBoundingRect(flexSheet.selection._row, flexSheet.selection._col).width;
      const top = event.cells._activeCell.offsetTop + flexSheet.scrollPosition.y - 10;
      const left = event.cells._activeCell.offsetLeft + flexSheet.scrollPosition.x + 30;
      this.createComponent(top, left, cell_width + 20, flexSheet.getCellValue(flexSheet.selection._row, flexSheet.selection._col),
        flexSheet.selection._row, flexSheet.selection._col);
    });
    flexSheet._addBoundRow([], flexSheet.rows.length);

    flexSheet.selectionChanged.addHandler(() => {
      setTimeout(() => {
        this.onSpreadSheetChange();
        this.editedPage = true;
        let multi_selection = true;
        const marquee_selector = document.querySelector('.wj-marquee') as HTMLDivElement;
        marquee_selector.className = 'wj-marquee';
        const selection = flexSheet.selection;
        if (selection._row === 0 && selection._row2 === flexSheet.rows.length - 1) {
          if (flexSheet.controlRect.height < flexSheet.rows.length * flexSheet.getCellBoundingRect(0, 0).height) {
            marquee_selector.className += ' add-marquee';
          } else {
            marquee_selector.className += ' add-marquee-below-flexsheet-height';
          }
        }

        // Check if selection is multi or single.
        if (selection._row === selection._row2 && selection._col === selection._col2) {
          multi_selection = false;
        }
        if (selection._col < 0 || selection._col2 < 0 || selection._row < 0 || selection._row2 < 0) {
          return;
        }
        const selecteEle = document.querySelector('.spreadsheet-statusbar-for-sum select') as HTMLSelectElement;
        const params = selecteEle.options[selecteEle.selectedIndex].value.split('...');
        let query = '';

        if (multi_selection) {
          const optionitems = selecteEle.querySelectorAll('option');
          for (let i = 0; i < optionitems.length; i++) {
            optionitems[i].setAttribute('hidden', 'hidden');
          }
          const items = selecteEle.querySelectorAll('option[value$="multi_selection"]');
          for (let i = 0; i < items.length; i++) {
            items[i].removeAttribute('hidden');
          }
        } else {
          const optionitems = selecteEle.querySelectorAll('option');
          for (let i = 0; i < optionitems.length; i++) {
            optionitems[i].removeAttribute('hidden');
          }
        }
        // Create query for multi-selection, single-param formulas, multi-params formulas
        switch (params[1]) {
          case 'multi_selection': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1}:${columns[selection._col]}${selection._row + 1})`;
          }
            break;
          case 'single_param': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1})`;
          }
            break;
          case 'double_param': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1}, _ )`;
          }
            break;
          case 'three_param': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1}, _ , _ )`;
          }
            break;
        }

        this.formulasSelectClass = 'hide';

        const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
        formula_value_ele.value = query;
        let query2 = '';
        if (multi_selection) {
          query2 = `=${params[0]}(`;
          if (selection._row2 > selection._row) {
            const temp = selection._row;
            selection._row = selection._row2;
            selection._row2 = temp;
          }
          if (selection._col2 > selection._col) {
            const temp = selection._col;
            selection._col = selection._col2;
            selection._col2 = temp;
          }
          for (let i = selection._row2; i <= selection._row; i++) {
            for (let j = selection._col2; j <= selection._col; j++) {
              const cellValue = flexSheet.getCellValue(i, j, true);
              const cellData = flexSheet.getCellData(i, j, true);
              query2 += `${cellValue}, `;
            }
          }
          query2 = query2.slice(0, -2);
          query2 += ')';
        } else {
          query2 = query;
        }
        console.log('query2', query2);
        const range = { row: 0, col: 0 };
        range.row = flexSheet.rows.length - 1;
        range.col = 0;
        flexSheet.setCellData(range.row, range.col, query2);
        let val = parseFloat(flexSheet.getCellValue(range.row, range.col, true));
        flexSheet.setCellData(range.row, range.col, '');
        if (isNaN(val)) {
          val = 0;
        }
        this.sumElement.nativeElement.innerHTML = val;
        if (window.innerWidth < 768) {
          formula_value_ele.value = `${query.slice(1, -1)}) = ${val.toString()}`;
        }
        if (!(this.prev_selection._row + 1 === flexSheet.selection._row && this.prev_selection._col === flexSheet.selection._col)) {
          this.container.clear();
        }
      }, 100);
    });

    flexSheet.scrollPositionChanged.addHandler(() => {
      this.container.clear();
    });

  }

  constructor(@Inject(DataSvc) dataSvc: DataSvc, private ngZone: NgZone, private resolver: ComponentFactoryResolver, private router: Router) {
    super(dataSvc);
    window.onresize = (e) => {
      this.ngZone.run(() => {
        setTimeout(this.resizeFormulasBarBtn(), 3000);
      });
    };
  }

  // Resize 'ok' btn on the top-right
  resizeFormulasBarBtn() {
    if (!document.querySelector('.spreadsheetcomponent')) {
      return;
    }
    const sheet_width = document.querySelector('.spreadsheetcomponent').clientWidth - this.flexSheet.rowHeaders.width;
    const cell_width = this.flexSheet.getCellBoundingRect(0, 0).width;
    const spreadsheet_ok_btns = document.querySelectorAll('.spreadsheet-ok-btn');
    const result_show_eles = document.querySelectorAll('.spreadsheet-result-show');

    for (let i = 0; i < spreadsheet_ok_btns.length; i++) {
      const btn = spreadsheet_ok_btns[i] as HTMLDivElement;
      const result_elements = result_show_eles[i] as HTMLDivElement;
      if (sheet_width % cell_width > cell_width * 0.5) {
        btn.style.width = `${sheet_width - Math.floor(sheet_width / cell_width) * cell_width}px`;
        result_elements.style.width = `${cell_width}px`;
      } else {
        btn.style.width = `${cell_width + sheet_width - Math.floor(sheet_width / cell_width) * cell_width}px`;
        result_elements.style.width = `${cell_width}px`;
        if (window.innerWidth < 500) {
          btn.style.width = `${sheet_width - Math.floor(sheet_width / cell_width) * cell_width}px`;
        }
      }
    }
  }

  // Create context menu for copy, cut, paste operations
  createComponent(top: number, left: number, width: number, value: number, row: number, col: number) {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(ContextMenuComponent);
    this.componentRef = this.container.createComponent(factory);

    this.componentRef.instance.top = top;
    this.componentRef.instance.left = left;
    this.componentRef.instance.width = width;
    this.componentRef.instance.value = value;
    this.componentRef.instance.row = row;
    this.componentRef.instance.col = col;
    this.componentRef.instance.copyEvent.subscribe(() => this.copyClipboard());
    this.componentRef.instance.pasteEvent.subscribe(() => this.pasteClipboard());
    this.componentRef.instance.cutEvent.subscribe(() => this.cutClipboard());
  }

  removeComponent() {
    this.container.clear();
  }

  // Load excel file from local computer
  load() {
    const self = this;
    const flexSheet = this.flexSheet,
      fileInput = <HTMLInputElement>document.getElementById('importFile');
    const reader = new FileReader();
    reader.onload = function (e) {
      flexSheet.load(reader.result);
      self.onSpreadSheetChange();
    };
    reader.readAsDataURL(fileInput.files[0]);
  }


  ngOnInit() {
    this.pageState = 'visible';
    localStorage.setItem('clipboard', '');
    const wijomomark = document.querySelector('[href^="http://wijmo.com/products/wijmo-5/eval/"]');
    if (wijomomark !== null) {
      // (<HTMLElement>wijomomark.parentNode).remove();
      const child = wijomomark.parentNode;
      (<HTMLElement>child).style.bottom = "-9999px";
      wijomomark.remove();
      //  wijomomark.innerHTML  = '';
      //const parent = wijomomark.parentNode.parentNode;
      //parent.removeChild(child);
      //   wijomomark.parentNode.remove();

    }
    const flexsheet = this.flexSheet;

    // dropbox button configuration
    const options = {
      success: function (file) {
        const anchor = document.createElement('a');
        anchor.href = file[0].link;
        anchor.target = '_blank';
        anchor.download = 'dropbox_' + file[0].name;
        anchor.click();
      },
      cancel: function () {

      },
      linkType: 'direct', // "preview" or "direct"
      multiselect: false, // true or false
      extensions: ['.xls', '.xlsx'],
    };

    const button = Dropbox.createChooseButton(options);
    document.getElementById('dropbox-container').appendChild(button);

    // Add 'Enter' Key Event Listener to Formula Input form
    const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
    formula_value_ele.addEventListener('keyup', function (event) {
      if (event.which === 13) {
        console.log('event pressed');
        this.blur();
        const selection = { row: 0, col: 0 };
        const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
        const query = formula_value_ele.value;
        selection.row = flexsheet.rows.length - 1;
        selection.col = 0;
        flexsheet.setCellData(selection.row, selection.col, query);
        let val = parseFloat(flexsheet.getCellValue(selection.row, selection.col, true));
        if (isNaN(val)) {
          val = 0;
        }
        const sumElements = document.querySelectorAll('.spreadsheet-result-show');
        for (let i = 0; i < sumElements.length; i++) {
          sumElements[i].innerHTML = val.toString();
        }
        if (window.innerWidth < 768) {
          formula_value_ele.value = val.toString();
        }
        flexsheet.setCellData(selection.row, selection.col, '');
      }
    });
  }

  // Spreadsheet Copy, Cut, Paste operations
  copyClipboard() {
    this.removeComponent();
  }

  cutClipboard() {
    const clipboard = JSON.parse(localStorage.getItem('clipboard'));
    this.flexSheet.setCellData(clipboard.row, clipboard.col, '');

    this.removeComponent();
  }

  pasteClipboard() {
    const clipboard = JSON.parse(localStorage.getItem('clipboard'));
    this.flexSheet.setCellData(clipboard.row, clipboard.col, clipboard.value);
    this.removeComponent();
  }

  // Show Formulas Select box when click on 'Sigma' button
  showFormulas() {
    this.formulasSelectClass = 'show-as-block';
  }

  onFormulasSelectionChanged() {
    const selecteEle = document.querySelector('.spreadsheet-statusbar-for-sum select') as HTMLSelectElement;
    const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
    const params = selecteEle.options[selecteEle.selectedIndex].value.split('...');
    switch (params[1]) {
      case 'multi_selection': {
        formula_value_ele.value = `=${params[0]}( _ : _ )`;
      }
        break;
      case 'single_param': {
        formula_value_ele.value = `=${params[0]}( _ )`;
      }
        break;
      case 'double_param': {
        formula_value_ele.value = `=${params[0]}( _ : _ )`;
      }
        break;
      case 'three_param': {
        formula_value_ele.value = `=${params[0]}( _ : _ : _ )`;
      }
        break;
    }
    this.formulasSelectClass = 'hide';
  }

  onSpreadSheetChange() {
    const workbook = this.flexSheet.saveAsync();
    const base64 = workbook.save();
    this.onChange(base64);
    this.forceSave.emit();
  }

  writeValue(value: string) {
    if (value) {
      this.flexSheet.load(value);
    }
  }

  onChange = (_) => { };
  onTouched = () => { };

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
