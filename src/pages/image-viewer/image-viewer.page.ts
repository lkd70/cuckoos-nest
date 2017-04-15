import { UploadModel } from './../../models/upload.model';
import { UserModel } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { LikeService } from './../../services/like.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { UploadService } from "../../services/upload.service";
import { UserService } from "../../services/user.service";
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'image-viewer-page',
  templateUrl: 'image-viewer.html',
})
export class ImageViewerPage {
  private upload: UploadModel;
  private uid: string;
  private isOwner: Boolean;
  private isLikeLoading: Boolean;
  private isLiked: Boolean;
  private displayName: string;

  constructor(private alertCtrl: AlertController, private viewCtrl: ViewController,
              private likeService: LikeService, private navCtrl: NavController,
              private navParams: NavParams, private uploadService: UploadService,
              private userService: UserService, private authService: AuthService) {
    this.upload = this.navParams.get('upload');
    this.userService.get(this.upload.user).subscribe(t=> this.displayName = t.displayName);

  }

  ionViewDidLoad(): void {
    this.uid = this.authService.currentUser.$key;
    this.isOwner = (this.uid == this.upload.user);
    this.likeService.getUids(this.upload.$key).subscribe(likes => {
      this.isLiked = (likes.indexOf(this.authService.currentUser.$key) != -1);
    });


  }

  private removePhoto() {
    let confirm = this.alertCtrl.create({
      title: 'Delete photo?',
      message: 'Are you sure that you want to remove this photo?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => { }
        },
        {
          text: 'Agree',
          handler: () => {
            this.uploadService.remove(this.upload.$key);
            this.navCtrl.pop();
          }
        }]
    });

    confirm.present();
  }

  private like() {
    this.isLikeLoading = true;
    if (this.isLiked == false) {
      this.likeService.like(this.upload.$key);
    }
    else {
      this.likeService.unlike(this.upload.$key);
    }
  }

  private comment() {
    this.navCtrl.push('CommentsPage', {
      upload: this.upload
    });
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

}
