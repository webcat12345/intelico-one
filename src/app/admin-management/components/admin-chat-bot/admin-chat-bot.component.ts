import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotService } from '@one-core/service/chatbot.service';
import { CommonService } from '@one-core/service/common.service';
import { UserService } from '@one-core/service/user.service';
import { LoaderType } from '@one-core/model';
import { wait } from '../../../core/utils/common.util';

@Component({
  selector: 'one-admin-admin-chat-bot',
  templateUrl: './admin-chat-bot.component.html',
  styleUrls: ['./admin-chat-bot.component.scss']
})
export class AdminChatBotComponent implements AfterViewInit {

  @ViewChild('messageList', {static: false}) messageList: ElementRef;

  chatBox: FormGroup = this.fb.group({
    message: ['', Validators.required]
  });

  LoaderType = LoaderType;
  messages: any[] = [];
  sending = false;

  constructor(
    private fb: FormBuilder,
    private chatbotService: ChatbotService,
    private commonService: CommonService,
    private userService: UserService
  ) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getUserDetail();
    }, 4000);
  }

  async getUserDetail() {
    try {
      // TODO: duplicate call to get user detail, need to find out the better solution for this
      await wait(3000);
      const res: any = await this.userService.getAccount().toPromise();
      if (res) {
        this.commonService.currentUser = res.item;
        this.messages.push({reply: true, text: `Hi ${this.commonService.currentUser.firstName}, let me know if you need any help below...`});
      }
    } catch (e) {
      console.error('failed to get user information...');
    }
  }

  async send() {
    try {
      this.sending = true;
      const message = this.chatBox.value.message;
      this.messages.push({reply: false, text: message});
      await this.scrollDownToBottom();
      this.chatBox.reset();
      const res = await this.chatbotService.sendMessage(message).toPromise();
      this.messages.push({reply: true, text: res});
      await this.scrollDownToBottom();
    } catch (e) {
      console.error(e);
    } finally {
      this.sending = false;
    }
  }

  private async scrollDownToBottom() {
    await wait(100);
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  }

}
