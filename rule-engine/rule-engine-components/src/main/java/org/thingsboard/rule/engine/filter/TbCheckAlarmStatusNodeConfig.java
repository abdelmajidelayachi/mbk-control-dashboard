/**
 * Copyright © 2016-2023 The Mbk Controls Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.thingsboard.rule.engine.filter;

import lombok.Data;
import org.thingsboard.rule.engine.api.NodeConfiguration;
import org.thingsboard.server.common.data.alarm.AlarmStatus;

import java.util.Arrays;
import java.util.List;

@Data
public class TbCheckAlarmStatusNodeConfig implements NodeConfiguration<TbCheckAlarmStatusNodeConfig> {
    private List<AlarmStatus> alarmStatusList;

    @Override
    public TbCheckAlarmStatusNodeConfig defaultConfiguration() {
        TbCheckAlarmStatusNodeConfig config = new TbCheckAlarmStatusNodeConfig();
        config.setAlarmStatusList(Arrays.asList(AlarmStatus.ACTIVE_ACK, AlarmStatus.ACTIVE_UNACK));
        return config;
    }
}