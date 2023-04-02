
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthzService } from '../services/authz.service';
import { PermissionPipe } from '../pipes/permission.pipe';
import { SafeHTMLPipe } from '../pipes/safe-html.pipe';
import { DirectionPipe } from '../pipes/direction.pipe';
import { IsSelectedPipe } from '../pipes/is-selected.pipe';
import { TranslateService } from '@ngx-translate/core';
import { UserTypePipe } from '../pipes/user-type.pipe';
import { Num2WordsPipe } from '../pipes/num2words.pipe';
import { ScapePipe } from '../pipes/scape.pipe';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { CountryNamePipe } from '../pipes/country-name.pipe';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [PermissionPipe, SafeHTMLPipe, DirectionPipe, DirectionPipe, IsSelectedPipe, UserTypePipe, Num2WordsPipe, ScapePipe, CountryNamePipe],
  exports: [PermissionPipe, SafeHTMLPipe, DirectionPipe, IsSelectedPipe, UserTypePipe, Num2WordsPipe, ScapePipe, CountryNamePipe],
  providers: [DecimalPipe, AuthzService, TranslateService, FileTransfer, FileTransferObject, File ,PDFGenerator]
})
export class PipesModule { }
