import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ActionTrigger } from '@one-core/model';
import { ActionStateService } from '../../services/action-state.service';
import { IWebhooksList, WebhooksService } from '@one-core/service/webhooks.service';

@Component({
  selector: 'one-admin-action-output ',
  templateUrl: './action-output.component.html',
  styleUrls: ['./action-output.component.scss']
})
export class ActionOutputComponent implements OnInit, OnDestroy {

  stepInfo: any = {};
  loading = false;
  bodyOutput: ActionTrigger;
  form: FormGroup;
  isValues: boolean;
  webhooksList: IWebhooksList = {data: [], totalCount: 0};
  webhooksListUI: IWebhooksList = {data: [], totalCount: 0};
  subscriptions: Subscription[] = [];

  constructor(
    public actionStateService: ActionStateService,
    private formBuilder: FormBuilder,
    private webhooksService: WebhooksService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.loading = true;
    this.webhooksService.getWebhooks().subscribe((res: IWebhooksList) => {
      this.webhooksList = res;
      this.webhooksListUI = res;
      this.loading = false;
      const webhook = this.actionStateService.getWebhook();
      if (webhook && webhook.metaData && webhook.metaData.webHooks) {
        this.form.get('urls').setValue(webhook.metaData.webHooks);
      }
    }, (err) => {
      console.error(err);
      this.loading = false;
    });

    this.subscriptions.push(
      this.form.get('urls').valueChanges.subscribe(id => {
        this.isValues = id.length > 0;
      }));

    /* this.form.get('urls').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((ids: Array<number>) => {
       const isOutput = ids.findIndex(x => +x === 0);
       console.log(isOutput);
       if (isOutput === -1) {
         this.webhooksListUI.data.map((item, index) => {
           if (item.id === 0) {
             this.webhooksListUI.data.splice(index, 1);
           }
         });
       } else if (isOutput !== -1) {
         this.webhooksListUI.data = [];
       } else if (ids.length === 0) {
         this.webhooksListUI = this.webhooksList;
         this.webhooksListUI.data.push({
           id: 0,
           name: 'No output',
           tenantKey: '',
           adminOutput: '',
           url: ''
         });
       }
       console.log(ids);
     });*/
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  initForm() {
    this.form = this.formBuilder.group({
      urls: [null, Validators.required]
    });
  }

  save() {
    const value = this.form.value;
    if (this.isValues) {
      const body = [];
      value.urls.map(item => {
        body.push(item);
      });
      this.bodyOutput = {
        name: 'webhook',
        metaData: {
          // webHooks: value ? value.urls || [] : []
          webHooks: body
        }
      };
    } else {
      this.bodyOutput = null;
    }
    if (this.isValues) {
      this.actionStateService.saveOutputForm(this.bodyOutput);
    } else {
      this.actionStateService.removeOutputForm();
    }
    this.actionStateService.changeStep(this.stepInfo.next);
  }
}
