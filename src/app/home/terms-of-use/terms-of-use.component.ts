import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Http} from '@angular/http';
import {TermsOfUseService} from './terms-of-use.service';

@Component({
  selector: 'ngbd-modal-content',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true"></span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{description}}</p>
    </div>    
  `,
  styleUrls: ['terms-of-use.component.scss'],
  providers: [TermsOfUseService]
})
export class TermsOfUseContent implements OnInit {
  @Input() title;
  @Input() description;

  constructor(public activeModal: NgbActiveModal, public termsOfUseService: TermsOfUseService) {}

  ngOnInit() {
    this.termsOfUseService.getPrivacyPolicy().subscribe(
      (response) => {console.log(response); }
    );

    if (this.title === 'Privacy Policy') {
      this.description = `
          Lorem ipsum dolor sit amet, veri facilis et usu, putent minimum vel eu. Vim at duis euripidis. Mel ex verear singulis posidonium, labore mollis voluptua mel ea. Vix solum assentior sententiae eu, qui tritani accusata cu, cibo perpetua explicari id eos. Quas aeque scribentur eam an. Pri habemus dignissim ei, ornatus epicuri eloquentiam vix te. Ad summo nobis aperiam usu, cu sea nisl ullum.

          Ius at zril impetus instructior. Agam conclusionemque sea no, vis an enim vero aliquid. Nam ei habeo paulo, iudico iuvaret duo ei. Semper petentium pro no, ad vix oblique utroque. In malis labitur usu, eu his nulla audire. Ei putent persecuti pro, nec illum facilisis at.
          
          Vis nullam vituperata instructior ex, sea modo movet melius te. Ne quo mollis sententiae, ei odio sanctus nam. Oportere elaboraret omittantur vel eu, ad mea modus choro persius. Sint iusto appareat pri at, nam ut paulo laudem menandri, possim numquam accusam eum ex. Eos principes reformidans ea, in usu illud dolor dolorum. In usu adhuc ocurreret, ex munere vocibus per.
          
          Probo populo ad vis. Epicuri accusata incorrupte in nec, eos an odio sensibus. Graecis assueverit concludaturque no sit, sea suas maiorum liberavisse cu, eu assum intellegebat eam. Qui amet purto ad, agam zril equidem vel ad, eos in dico liber inciderint. Posse nullam torquatos eu sea, an has oratio graeco consulatu. Consequat concludaturque per ei.
          
          Has stet consul eu. Sit cu vidit legere dolorem, ad atqui percipitur mei. Nonumy eleifend qui eu, qui ei tota vidisse regione, eligendi definiebas usu ad. Simul nobis nominati at mei. Convenire adversarium per no.
          
          Fugit delicata senserit qui cu. Et est oblique eruditi. An his impetus indoctum. An petentium constituto eam, ei nam harum aperiri pericula. Ius audire insolens ei, assum placerat mea ne. Errem commodo sed ut, ad his mucius semper comprehensam.
          
          Sit an persius inciderint, per id melius iuvaret consulatu. Cu liber tation dolores eam. Ex reque dictas constituto mea, cu nullam vidisse tritani eos. Tota fabellas at eam, velit ignota consetetur nec ne.
          
          At mei quem lucilius patrioque. No nec aliquid oporteat adipisci. Volutpat expetenda ad nam, ex sit nonumy scripta, nam graeci consetetur ea. Eu his ignota audire tacimates, per et percipit vivendum, vis cu dicat aliquip atomorum. Iisque legimus nominavi vis te, adolescens eloquentiam ea ius.
          
          Malorum eloquentiam sea id. Veri iriure intellegam an qui, cum possit eleifend ea. Vim et fugit offendit, cu nulla quidam vis. Quas regione imperdiet sed no, sint mnesarchum no usu, et vel ornatus sensibus. An nostro petentium sit.
          
          Eu vim eripuit verterem quaestio, graeco utroque eum ut, labores omittantur mea ne. Exerci oportere necessitatibus mea an, quod platonem in vis, malis tollit accusamus et mea. Noluisse definitiones ex duo. Eos at augue ludus appellantur, stet mandamus ex pri.
          
          Eam an deleniti tincidunt. Est ad nulla erant veniam, no ius vero appellantur. An est quando quaerendum adversarium. Ne nobis quando recusabo nam. Agam vivendum quaerendum eam te, at nec aperiri appareat. Ridens percipit has ex, ei sumo hinc has, odio causae ornatus no quo. Ne nonumy audire scaevola vix, ipsum insolens usu an, et detracto singulis vis.
          
          Eu sint labitur sed, omnis indoctum ius no, paulo suscipit nam ut. No quo dicunt interesset. Eu sea populo persius vocibus, ei albucius quaestio mnesarchum has. Ea debet petentium argumentum sea, has at posse appellantur, te eos qualisque conceptam argumentum. Nam everti noluisse et, ex case option cum. Id qui iisque iuvaret indoctum, te impetus consetetur eam. Eros nominati pro at, at persecuti reformidans contentiones usu.
          
          Qui ut quod dissentiet, minimum liberavisse vim et, quis idque in vim. Eligendi oportere qui ad. In sea modo iusto, ferri soluta persecuti mea ad. Vis in nonumy iriure evertitur. Mazim noluisse id quo. Nam case senserit periculis ne, vix ex labore noster assueverit. Nihil expetenda persequeris mel no, zril viderer pertinax pri ex.
          
          Ut vero interesset quo, veri zril te vis. Ad alterum mentitum pri, ex eius accusamus ius. Eu tale ullamcorper mel, ea usu quot dictas. Vis ancillae offendit vituperata in. Cu vel rebum ponderum, pri suas ornatus in, sadipscing temporibus ea qui. In ignota impedit imperdiet sit, at dolore feugiat delicatissimi qui, ut mel omnes cetero.
          
          Mea cu odio vidisse contentiones. Nibh legere delectus in pro. Ad qui modo tollit, ne eam veri evertitur. Id facete putant apeirian vim. Cu vel diceret nominavi honestatis, in corpora interesset has.
          
          Vel dicit delicata pertinacia id. Ex alia agam noluisse vis. Facilis elaboraret ne eum, te movet partiendo vix. Ius suas accusamus posidonium ea. Semper adolescens persequeris no cum.
          
          Id sed inermis abhorreant. Pro in numquam nominavi, quo ut sonet patrioque. Utinam expetenda ea nec, no lorem aliquid convenire pro. Eam ut vero iudico ignota, cu vim postulant scripserit, purto doctus torquatos usu et. 
      `;
      return;
    }

    if (this.title === 'Terms of Use') {
      this.description = `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Neque laoreet suspendisse interdum consectetur libero. Id diam maecenas ultricies mi eget mauris pharetra et. Ullamcorper malesuada proin libero nunc consequat interdum varius. Nunc non blandit massa enim nec dui nunc mattis. Ultrices vitae auctor eu augue ut. Neque sodales ut etiam sit amet nisl purus in mollis. Bibendum at varius vel pharetra vel turpis nunc eget. Aliquet risus feugiat in ante metus dictum. Habitant morbi tristique senectus et. Elementum facilisis leo vel fringilla est ullamcorper. Sit amet est placerat in egestas erat. Viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Accumsan lacus vel facilisis volutpat est velit egestas. Vivamus at augue eget arcu dictum. Risus commodo viverra maecenas accumsan lacus. Congue mauris rhoncus aenean vel elit scelerisque. Viverra vitae congue eu consequat ac. Tempus urna et pharetra pharetra massa.

          Diam in arcu cursus euismod quis. Leo a diam sollicitudin tempor id eu nisl nunc. Phasellus egestas tellus rutrum tellus pellentesque eu. Urna nunc id cursus metus aliquam eleifend. Consectetur a erat nam at lectus urna duis convallis convallis. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Nisl purus in mollis nunc sed id semper risus. Eleifend donec pretium vulputate sapien nec sagittis. Leo vel orci porta non pulvinar. Bibendum at varius vel pharetra vel. Aliquet risus feugiat in ante metus. Gravida neque convallis a cras semper auctor neque. Nisl nunc mi ipsum faucibus vitae aliquet nec. Varius duis at consectetur lorem. Scelerisque eu ultrices vitae auctor eu augue ut. Donec pretium vulputate sapien nec.
          
          Accumsan tortor posuere ac ut. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Adipiscing tristique risus nec feugiat in fermentum. Praesent elementum facilisis leo vel fringilla est ullamcorper. Nibh tortor id aliquet lectus proin nibh nisl condimentum. Adipiscing vitae proin sagittis nisl. Tincidunt dui ut ornare lectus sit amet est placerat. Velit euismod in pellentesque massa placerat duis ultricies. Maecenas volutpat blandit aliquam etiam erat velit scelerisque. Luctus venenatis lectus magna fringilla. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Vitae et leo duis ut. Porta non pulvinar neque laoreet suspendisse interdum consectetur. Netus et malesuada fames ac. In arcu cursus euismod quis viverra nibh cras pulvinar. Auctor augue mauris augue neque gravida in fermentum. Sed felis eget velit aliquet sagittis id consectetur.
          
          Nunc mi ipsum faucibus vitae. Ac feugiat sed lectus vestibulum mattis ullamcorper. Aliquam nulla facilisi cras fermentum odio eu feugiat. Sed risus ultricies tristique nulla aliquet enim tortor at auctor. Quisque egestas diam in arcu cursus euismod quis. Eget nunc scelerisque viverra mauris. Varius quam quisque id diam. Sed viverra ipsum nunc aliquet. Eu scelerisque felis imperdiet proin fermentum leo vel orci porta. Et malesuada fames ac turpis egestas sed tempus urna.
          
          Ultrices tincidunt arcu non sodales neque sodales ut. Quisque egestas diam in arcu cursus. Ultricies leo integer malesuada nunc vel risus commodo. Turpis egestas sed tempus urna et pharetra pharetra massa. Et ligula ullamcorper malesuada proin libero nunc consequat interdum varius. Integer feugiat scelerisque varius morbi enim nunc. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Dignissim enim sit amet venenatis urna cursus eget nunc. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Bibendum arcu vitae elementum curabitur. Dignissim sodales ut eu sem integer vitae justo eget. Sagittis purus sit amet volutpat consequat mauris. At auctor urna nunc id cursus metus aliquam eleifend mi. Aliquet nibh praesent tristique magna. Erat nam at lectus urna duis convallis convallis tellus id. Lorem donec massa sapien faucibus et. Massa eget egestas purus viverra accumsan in. Tellus rutrum tellus pellentesque eu tincidunt.
          
          Neque sodales ut etiam sit. Enim praesent elementum facilisis leo vel fringilla. Magna eget est lorem ipsum dolor sit amet consectetur adipiscing. Sit amet mattis vulputate enim nulla aliquet. Ipsum a arcu cursus vitae congue mauris rhoncus aenean. Gravida dictum fusce ut placerat orci. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Aliquet sagittis id consectetur purus. Sed enim ut sem viverra aliquet eget. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Faucibus turpis in eu mi bibendum.
          
          Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Ullamcorper malesuada proin libero nunc consequat interdum varius sit amet. Consectetur lorem donec massa sapien faucibus et molestie. Ultrices gravida dictum fusce ut placerat orci. Ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia. Lacus laoreet non curabitur gravida arcu ac. In vitae turpis massa sed elementum tempus egestas sed. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Urna molestie at elementum eu facilisis sed odio morbi quis. Sed felis eget velit aliquet sagittis. Dignissim convallis aenean et tortor at risus. Sed tempus urna et pharetra pharetra massa massa ultricies. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Non tellus orci ac auctor augue mauris augue. Natoque penatibus et magnis dis parturient. Tincidunt augue interdum velit euismod in pellentesque.
          
          Ut eu sem integer vitae justo eget. Fusce ut placerat orci nulla pellentesque dignissim enim. Gravida neque convallis a cras semper auctor neque. Sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum. Neque sodales ut etiam sit amet nisl purus in mollis. Nunc faucibus a pellentesque sit amet porttitor. Pretium quam vulputate dignissim suspendisse. Ornare arcu dui vivamus arcu felis bibendum ut tristique et. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. In mollis nunc sed id. Quam viverra orci sagittis eu volutpat odio. Nisl pretium fusce id velit ut tortor pretium viverra suspendisse. Ultricies mi quis hendrerit dolor magna eget.
          
          Pellentesque eu tincidunt tortor aliquam nulla facilisi. Erat imperdiet sed euismod nisi porta lorem mollis aliquam ut. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Gravida cum sociis natoque penatibus et magnis dis parturient montes. Pellentesque nec nam aliquam sem et tortor consequat id. Cursus mattis molestie a iaculis at erat pellentesque. Adipiscing commodo elit at imperdiet dui accumsan sit amet. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Diam vel quam elementum pulvinar etiam non quam lacus suspendisse. Lobortis mattis aliquam faucibus purus. Sit amet mauris commodo quis imperdiet. Vel orci porta non pulvinar neque laoreet suspendisse. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget. Augue ut lectus arcu bibendum at. Odio tempor orci dapibus ultrices in. Vivamus at augue eget arcu dictum varius.
          
          Consectetur purus ut faucibus pulvinar elementum integer. Quis eleifend quam adipiscing vitae proin. Cursus in hac habitasse platea dictumst quisque. Proin nibh nisl condimentum id venenatis. Ullamcorper malesuada proin libero nunc consequat interdum varius sit. At erat pellentesque adipiscing commodo elit at imperdiet dui accumsan. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Arcu ac tortor dignissim convallis aenean et tortor at risus. Justo nec ultrices dui sapien. Imperdiet massa tincidunt nunc pulvinar sapien et ligula. Arcu odio ut sem nulla pharetra diam sit amet nisl. Suspendisse potenti nullam ac tortor vitae purus faucibus. Nec dui nunc mattis enim ut tellus elementum sagittis. Eget aliquet nibh praesent tristique magna sit amet. Fermentum dui faucibus in ornare quam viverra orci. Lorem dolor sed viverra ipsum nunc aliquet.
      `;
    }
  }
}