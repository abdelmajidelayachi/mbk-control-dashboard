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

import { Component } from '@angular/core';
import { EntityTableHeaderComponent } from '@home/components/entity/entity-table-header.component';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { Notification } from '@shared/models/notification.models';

@Component({
  selector: 'tb-inbox-table-header',
  templateUrl: './inbox-table-header.component.html',
  styleUrls: ['inbox-table-header.component.scss']
})
export class InboxTableHeaderComponent extends EntityTableHeaderComponent<Notification> {

  constructor(protected store: Store<AppState>) {
    super(store);
  }

  changeUnreadOnly(unreadOnly: boolean) {
    this.entitiesTableConfig.componentsData.unreadOnly = unreadOnly;
    this.entitiesTableConfig.getTable().resetSortAndFilter(true);
  }

}
