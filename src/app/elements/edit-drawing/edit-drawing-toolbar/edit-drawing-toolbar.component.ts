import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Toolbar component for editing fonts, colors and sizes on diagrams
 *
 * @input editedStyle - style object of editing element
 * @input toolbarPosition - x and y coordinates, where toolbar should be opened
 * @input tool - tool, that should be opened font|figure|color
 *
 * @output styleChanged - event, triggered when style changed
 */
@Component({
  selector: 'app-edit-drawing-toolbar',
  templateUrl: './edit-drawing-toolbar.component.html',
  styleUrls: [
    './edit-drawing-toolbar.component.scss'
  ]
})
export class EditDrawingToolbarComponent {
  @Input() editingStyle: object;
  @Input() toolbarPosition: object;
  @Input() tool: any;

  @Output() styleChanged: EventEmitter<object> = new EventEmitter();

  prevTool: string;
  colors = [
    {name: 'black', hex: '#000000'},
    {name: 'white', hex: '#ffffff'},
    {name: 'red', hex: '#FF0827'},
    {name: 'orange', hex: '#F5A623'},
    {name: 'yellow', hex: '#F8E71C'},
    {name: 'green', hex: '#7ED321'},
    {name: 'blue', hex: '#679BF9'},
    {name: 'dark-blue', hex: '#4342E6'},
    {name: 'transparent', hex: 'transparent'}
  ];
  editedColor: string;
  editingSize = false;


  getSelectedColor (color) {
    this.editingStyle[this.editedColor] = color.hex;
    this.tool = this.prevTool;
    this.styleChanged.emit(this.editingStyle);
  }

  openColorPicker (editedColor) {
    this.editedColor = editedColor;
    this.prevTool = this.tool;
    this.tool = 'color';
  }

  changeBorderStyle() {
    this.editingStyle['dashed'] = this.editingStyle['dashed'] === '0' ? '1' : '0';
    this.styleChanged.emit(this.editingStyle);
  }

  validateSize(event) {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }

  changeSize(event) {
    if (event.target.value === '') {
      this.editingStyle[event.target.name] = 1;
    }

    this.editingSize = !this.editingSize;
    this.styleChanged.emit(this.editingStyle);
  }

  editSize () {
    this.editingSize = !this.editingSize;
    setTimeout(function () {
      document.getElementById('edit-size').focus();
    }, 100);
  }
}
