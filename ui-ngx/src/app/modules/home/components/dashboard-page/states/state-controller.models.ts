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

import { IStateController, StateObject } from '@core/api/widget-api.models';
import { IDashboardController } from '@home/components/dashboard-page/dashboard-page.models';
import { DashboardState } from '@shared/models/dashboard.models';

export declare type StateControllerState = StateObject[];

export interface IStateControllerComponent extends IStateController {
  stateControllerInstanceId: string;
  state: string;
  currentState: string;
  syncStateWithQueryParam: boolean;
  isMobile: boolean;
  states: {[id: string]: DashboardState };
  dashboardId: string;
  preservedState: any;
  reInit(): void;
  init(): void;
}