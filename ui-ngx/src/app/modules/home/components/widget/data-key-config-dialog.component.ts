///
/// Copyright © 2016-2023 The Mbk Controls Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, Inject, OnInit, SkipSelf, ViewChild } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogComponent } from '@shared/components/dialog.component';
import { DataKey, Widget, widgetType } from '@shared/models/widget.models';
import { DataKeysCallbacks } from './data-keys.component.models';
import { DataKeyConfigComponent } from '@home/components/widget/data-key-config.component';
import { Dashboard } from '@shared/models/dashboard.models';
import { IAliasController } from '@core/api/widget-api.models';

export interface DataKeyConfigDialogData {
  dataKey: DataKey;
  dataKeySettingsSchema: any;
  dataKeySettingsDirective: string;
  dashboard: Dashboard;
  aliasController: IAliasController;
  widget: Widget;
  widgetType: widgetType;
  entityAliasId?: string;
  showPostProcessing?: boolean;
  callbacks?: DataKeysCallbacks;
}

@Component({
  selector: 'tb-data-key-config-dialog',
  templateUrl: './data-key-config-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: DataKeyConfigDialogComponent}],
  styleUrls: ['./data-key-config-dialog.component.scss']
})
export class DataKeyConfigDialogComponent extends DialogComponent<DataKeyConfigDialogComponent, DataKey>
  implements OnInit, ErrorStateMatcher {

  @ViewChild('dataKeyConfig', {static: true}) dataKeyConfig: DataKeyConfigComponent;

  dataKeyFormGroup: UntypedFormGroup;

  submitted = false;

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: DataKeyConfigDialogData,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<DataKeyConfigDialogComponent, DataKey>,
              public fb: UntypedFormBuilder) {
    super(store, router, dialogRef);
  }

  ngOnInit(): void {
    this.dataKeyFormGroup = this.fb.group({
      dataKey: [this.data.dataKey, [Validators.required]]
    });
  }

  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this.errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.submitted);
    return originalErrorState || customErrorState;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.submitted = true;
    this.dataKeyConfig.validateOnSubmit();
    if (this.dataKeyFormGroup.valid) {
      const dataKey: DataKey = this.dataKeyFormGroup.get('dataKey').value;
      this.dialogRef.close(dataKey);
    }
  }
}
