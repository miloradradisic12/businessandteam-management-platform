import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule, LocationStrategy, HashLocationStrategy} from '@angular/common';
import {Ng2DeviceDetectorModule} from 'ng2-device-detector';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';

import {CoreModule} from './core/core.modules';
import {AuthModule} from './auth/auth.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {TermsOfUseContent} from './home/terms-of-use/terms-of-use.component';
import {environment} from 'environments/environment';
import {MessagingService} from 'app/core/messaging.service';
// import 'hammerjs';
import {SharedModule} from 'app/shared/shared.module';
import { LoadingModule,ANIMATION_TYPES } from 'ngx-loading';
import { LoaderService } from './loader.service';
import { SharedEmployeeModule } from './shared/sharedEmployee.module';
import { SharedInterviewRescheduleModule } from './shared/shared-interview-reschedule.module';
import { CommonComponentModule } from 'app/common/common.module';

// import { MatchHeightDirective } from './elements/match-height/match-height.directive';
import * as Hammer from 'hammerjs';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      // override hammerjs default configuration
      'swipe': { direction: Hammer.DIRECTION_ALL  }
  }
}


@NgModule({
  declarations: [
    AppComponent,
    TermsOfUseContent
  ],
  imports: [
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    Ng2DeviceDetectorModule.forRoot(),
    CommonModule,
    CoreModule,
    AuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    SharedModule,
    SharedEmployeeModule,
    SharedInterviewRescheduleModule,
    LoadingModule,
    CommonComponentModule
    
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  { 
    provide: HAMMER_GESTURE_CONFIG, 
    useClass: MyHammerConfig 
  }, MessagingService,LoaderService],
  entryComponents: [TermsOfUseContent],
  bootstrap: [AppComponent],
})
export class AppModule { }
