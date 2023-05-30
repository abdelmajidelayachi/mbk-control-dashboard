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

import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CmdUpdate, CmdUpdateMsg, CmdUpdateType, WebsocketCmd } from '@shared/models/telemetry/telemetry.models';
import { map } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { isDefinedAndNotNull } from '@core/utils';
import { Notification } from '@shared/models/notification.models';
import { CmdWrapper, WsSubscriber } from '@shared/models/websocket/websocket.models';
import { NotificationWebsocketService } from '@core/ws/notification-websocket.service';

export class NotificationCountUpdate extends CmdUpdate {
  totalUnreadCount: number;

  constructor(msg: NotificationCountUpdateMsg) {
    super(msg);
    this.totalUnreadCount = msg.totalUnreadCount;
  }
}

export class NotificationsUpdate extends CmdUpdate {
  totalUnreadCount: number;
  update?: Notification;
  notifications?: Notification[];

  constructor(msg: NotificationsUpdateMsg) {
    super(msg);
    this.totalUnreadCount = msg.totalUnreadCount;
    this.update = msg.update;
    this.notifications = msg.notifications;
  }
}

export class NotificationSubscriber extends WsSubscriber {
  private notificationCountSubject = new ReplaySubject<NotificationCountUpdate>(1);
  private notificationsSubject = new BehaviorSubject<NotificationsUpdate>({
    cmdId: 0,
    cmdUpdateType: undefined,
    errorCode: 0,
    errorMsg: '',
    notifications: [],
    totalUnreadCount: 0
  });

  public messageLimit = 10;

  public notificationCount$ = this.notificationCountSubject.asObservable().pipe(map(msg => msg.totalUnreadCount));
  public notifications$ = this.notificationsSubject.asObservable().pipe(map(msg => msg.notifications ));

  public static createNotificationCountSubscription(notificationWsService: NotificationWebsocketService,
                                                    zone: NgZone): NotificationSubscriber {
    const subscriptionCommand = new UnreadCountSubCmd();
    const subscriber = new NotificationSubscriber(notificationWsService, zone);
    subscriber.subscriptionCommands.push(subscriptionCommand);
    return subscriber;
  }

  public static createNotificationsSubscription(notificationWsService: NotificationWebsocketService,
                                                zone: NgZone, limit = 10): NotificationSubscriber {
    const subscriptionCommand = new UnreadSubCmd(limit);
    const subscriber = new NotificationSubscriber(notificationWsService, zone);
    subscriber.messageLimit = limit;
    subscriber.subscriptionCommands.push(subscriptionCommand);
    return subscriber;
  }

  public static createMarkAsReadCommand(notificationWsService: NotificationWebsocketService,
                                        ids: string[]): NotificationSubscriber {
    const subscriptionCommand = new MarkAsReadCmd(ids);
    const subscriber = new NotificationSubscriber(notificationWsService);
    subscriber.subscriptionCommands.push(subscriptionCommand);
    return subscriber;
  }

  public static createMarkAllAsReadCommand(notificationWsService: NotificationWebsocketService): NotificationSubscriber {
    const subscriptionCommand = new MarkAllAsReadCmd();
    const subscriber = new NotificationSubscriber(notificationWsService);
    subscriber.subscriptionCommands.push(subscriptionCommand);
    return subscriber;
  }

  constructor(private notificationWsService: NotificationWebsocketService, protected zone?: NgZone) {
    super(notificationWsService, zone);
  }

  onNotificationCountUpdate(message: NotificationCountUpdate) {
    if (this.zone) {
      this.zone.run(
        () => {
          this.notificationCountSubject.next(message);
        }
      );
    } else {
      this.notificationCountSubject.next(message);
    }
  }

  public complete() {
    this.notificationCountSubject.complete();
    this.notificationsSubject.complete();
    super.complete();
  }

  onNotificationsUpdate(message: NotificationsUpdate) {
    const currentNotifications = this.notificationsSubject.value;
    let processMessage = message;
    if (isDefinedAndNotNull(currentNotifications) && message.update) {
      currentNotifications.notifications.unshift(message.update);
      if (currentNotifications.notifications.length > this.messageLimit) {
        currentNotifications.notifications.pop();
      }
      processMessage = currentNotifications;
      processMessage.totalUnreadCount = message.totalUnreadCount;
    }
    if (this.zone) {
      this.zone.run(
        () => {
          this.notificationsSubject.next(processMessage);
          this.notificationCountSubject.next(processMessage);
        }
      );
    } else {
      this.notificationsSubject.next(processMessage);
      this.notificationCountSubject.next(processMessage);
    }
  }
}

export class UnreadCountSubCmd implements WebsocketCmd {
  cmdId: number;
}

export class UnreadSubCmd implements WebsocketCmd {
  limit: number;
  cmdId: number;

  constructor(limit = 10) {
    this.limit = limit;
  }
}

export class UnsubscribeCmd implements WebsocketCmd {
  cmdId: number;
}

export class MarkAsReadCmd implements WebsocketCmd {

  cmdId: number;
  notifications: string[];

  constructor(ids: string[]) {
    this.notifications = ids;
  }
}

export class MarkAllAsReadCmd implements WebsocketCmd {
  cmdId: number;
}

export interface NotificationCountUpdateMsg extends CmdUpdateMsg {
  cmdUpdateType: CmdUpdateType.NOTIFICATIONS_COUNT;
  totalUnreadCount: number;
}

export interface NotificationsUpdateMsg extends CmdUpdateMsg {
  cmdUpdateType: CmdUpdateType.NOTIFICATIONS;
  totalUnreadCount: number;
  update?: Notification;
  notifications?: Notification[];
}

export type WebsocketNotificationMsg = NotificationCountUpdateMsg | NotificationsUpdateMsg;

export const isNotificationCountUpdateMsg = (message: WebsocketNotificationMsg): message is NotificationCountUpdateMsg => {
  const updateMsg = (message as CmdUpdateMsg);
  return updateMsg.cmdId !== undefined && updateMsg.cmdUpdateType === CmdUpdateType.NOTIFICATIONS_COUNT;
};

export const isNotificationsUpdateMsg = (message: WebsocketNotificationMsg): message is NotificationsUpdateMsg => {
  const updateMsg = (message as CmdUpdateMsg);
  return updateMsg.cmdId !== undefined && updateMsg.cmdUpdateType === CmdUpdateType.NOTIFICATIONS;
};

export class NotificationPluginCmdWrapper implements CmdWrapper {

  constructor() {
    this.unreadCountSubCmd = null;
    this.unreadSubCmd = null;
    this.unsubCmd = null;
    this.markAsReadCmd = null;
    this.markAllAsReadCmd = null;
  }

  unreadCountSubCmd: UnreadCountSubCmd;
  unreadSubCmd: UnreadSubCmd;
  unsubCmd: UnsubscribeCmd;
  markAsReadCmd: MarkAsReadCmd;
  markAllAsReadCmd: MarkAllAsReadCmd;

  public hasCommands(): boolean {
    return isDefinedAndNotNull(this.unreadCountSubCmd) ||
      isDefinedAndNotNull(this.unreadSubCmd) ||
      isDefinedAndNotNull(this.unsubCmd) ||
      isDefinedAndNotNull(this.markAsReadCmd) ||
      isDefinedAndNotNull(this.markAllAsReadCmd);
  }

  public clear() {
    this.unreadCountSubCmd = null;
    this.unreadSubCmd = null;
    this.unsubCmd = null;
    this.markAsReadCmd = null;
    this.markAllAsReadCmd = null;
  }

  public preparePublishCommands(): NotificationPluginCmdWrapper {
    const preparedWrapper = new NotificationPluginCmdWrapper();
    preparedWrapper.unreadCountSubCmd = this.unreadCountSubCmd || undefined;
    preparedWrapper.unreadSubCmd = this.unreadSubCmd || undefined;
    preparedWrapper.unsubCmd = this.unsubCmd || undefined;
    preparedWrapper.markAsReadCmd = this.markAsReadCmd || undefined;
    preparedWrapper.markAllAsReadCmd = this.markAllAsReadCmd || undefined;
    this.clear();
    return preparedWrapper;
  }
}
