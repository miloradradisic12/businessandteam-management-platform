import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as jsPDF from 'jspdf';
import { ProjectsService, Visibility } from 'app/projects/projects.service';
import { AccountService } from 'app/founder/account/account.service';


@Component({
  templateUrl: './nda.component.html',
  styleUrls: ['./nda.component.scss']
})
export class NdaComponent implements OnInit {
  id: number;
  ndaData: any;
  defaultNDA: string = `<p class="ql-align-center"><strong style="color: rgb(26, 26, 26);">Non-Disclosure Agreement</strong></p><p><span style="color: rgb(26, 26, 26);">1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This Nondisclosure Agreement is entered into by and between {{party 1}} with his principal office at {{party 1 address}} and ____________________________, for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below. The parties agree to enter into a confidential relationship with respect to the disclosure of certain proprietary and confidential information - "All drawings, codes and ideas, concepts, designs, innovations, and all other material relating to the concept and idea of _________. This includes both physical and verbal information.”</span></p><p><br></p><p><span style="color: rgb(26, 26, 26);">2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Definition of Confidential Information. For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. If Confidential Information is in written form, the Disclosing Party shall label or stamp the materials with the word "Confidential" or some similar warning. If Confidential Information is transmitted orally, the Disclosing Party shall promptly provide a writing indicating that such oral communication constituted Confidential Information.</span></p><p><br></p><p><span style="color: rgb(26, 26, 26);">3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Obligations of Receiving Party. Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. Receiving Party shall carefully restrict access to Confidential Information to employees, contractors and third parties as is reasonably required and shall require those persons to sign nondisclosure restrictions at least as protective as those in this Agreement. Receiving Party shall not, without prior written approval of Disclosing Party, use for Receiving Party's own benefit, publish, copy, or otherwise disclose to others, or permit the use by others for their benefit or to the detriment of Disclosing Party, any Confidential Information. Receiving Party shall return to Disclosing Party any and all records, notes, and other written, printed, or tangible materials in its possession pertaining to Confidential Information immediately if Disclosing Party requests it in writing.</span></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><span style="color: rgb(26, 26, 26);">4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time Periods. The nondisclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party sends Receiving Party written notice releasing Receiving Party from this Agreement, whichever occurs first.</span></p><p><br></p><p><br></p><p><span style="color: rgb(26, 26, 26);">5.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Relationships. Nothing contained in this Agreement shall be deemed to constitute either party a partner, joint venturer or employee of the other party for any purpose.</span></p><p><br></p><p><span style="color: rgb(26, 26, 26);">&nbsp;</span></p><p><span style="color: rgb(26, 26, 26);">6.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Severability. If a court finds any provision of this Agreement invalid or unenforceable, the remainder of this Agreement shall be interpreted so as best to effect the intent of the parties.&nbsp;</span></p><p><br></p><p><br></p><p><span style="color: rgb(26, 26, 26);">7.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Integration. This Agreement expresses the complete understanding of the parties with respect to the subject matter and supersedes all prior proposals, agreements, representations and understandings. This Agreement may not be amended except in a writing signed by both parties.</span></p><p><br></p><p><br></p><p><span style="color: rgb(26, 26, 26);">8.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Waiver. The failure to exercise any right provided in this Agreement shall not be a waiver of prior or subsequent rights.</span></p><p><br></p><p><span style="color: rgb(26, 26, 26);">This Agreement and each party's obligations shall be binding on the representatives, assigns and successors of such party. Each party has signed this Agreement through its authorized representative.</span></p><p><br></p><p><br></p><p><span style="color: rgb(26, 26, 26);">Receiving Party;</span></p><p><span style="color: rgb(26, 26, 26);">___________________________ (Printed Name.) _______________________(Date, Place.)</span></p><p><br></p><p><br></p><p><span style="color: rgb(26, 26, 26);">_______________________&nbsp;(Signature.)</span></p><p><br></p><p><br></p><p><br></p><p>Disclosing Party;</p><p>&nbsp;</p><p><span style="color: rgb(26, 26, 26);">___________________________ (Printed Name.) _______________________(Date, Place.)</span></p><p><br></p><p><span style="color: rgb(26, 26, 26);">﻿</span></p><p><span style="color: rgb(26, 26, 26);">_______________________&nbsp;(Signature.)</span></p>`;


  constructor(
    private route: ActivatedRoute, public location: Location,
    private accountService: AccountService, private projectService: ProjectsService
  ) { }

  ngOnInit() {
    //this.ndaData = { 'id': '', 'description': '' };
    this.ndaData = { 'id': '', 'description': '', 'creator_email': '', 'docusign_status': '' };
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getUserProfile();
    //this.fetchNda(this.id);
  }

  onSubmit() {
    if (this.ndaData.id == '') {
      this.insertNda(this.id, this.ndaData);
    } else {
      this.updateNda(this.id, this.ndaData);
    }
  }

  insertNda(id, ndaData) {
    const self = this;

    let pdf = new jsPDF('p', 'pt', 'letter');

    let specialElementHandlers = {
      // element with id of "bypass" - jQuery style selector      
      '#editor': function (element, renderer) {
        return true;
      },
      '.controls': function (element, renderer) {
        return true;
      }
    }
    let margins = {
      top: 80,
      bottom: 10,
      left: 40,
      right: 40,
      width: 522
    };


    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML
      (
      ndaData.description // HTML string or DOM elem ref.
      , margins.left // x coord
      , margins.top // y coord
      , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
      }
      , function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        // this allow the insertion of new lines after html
        ndaData.document = pdf.output('datauristring');
        ndaData.document_name = 'NDA.pdf';
        ndaData.creatorXposition = 50;
        ndaData.creatorYposition = 665;
        self.projectService.insertNda(id, ndaData)
          .subscribe(
            data => {
              self.location.back();
            },
            error => {
              //alert(error);
              console.log(error);
            }
          );
      }
      , margins);

  }

  fetchNda(projectId: number) {
    this.projectService.fetchNda(projectId)
      .subscribe(
        data => {
          this.ndaData.id = (data.id == undefined) ? '' : data.id;
          if (this.ndaData.id === '') {
            this.ndaData.description = this.defaultNDA;
          }
          else {
            this.ndaData.description = data.description;
          }
          this.ndaData.docusign_status = data.docusign_status;
        },
        error => {
          alert(error);
        }
      );
  }

  updateNda(id, ndaData) {
    this.projectService.updateNda(id, ndaData)
      .subscribe(
        data => {
          this.location.back();
        },
        error => {
          alert(error);
        }
      );
  }

  getUserProfile() {
    this.accountService.getProfile().subscribe((userProfile: any) => {
      this.ndaData.creator_email = userProfile.email;
      this.fetchNda(this.id);
    });
  }
}
