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
package org.thingsboard.server.service.apiusage.limits;

import lombok.RequiredArgsConstructor;
import org.thingsboard.server.common.data.tenant.profile.DefaultTenantProfileConfiguration;

import java.util.function.Function;

@RequiredArgsConstructor
public enum LimitedApi {

    ENTITY_EXPORT(DefaultTenantProfileConfiguration::getTenantEntityExportRateLimit),
    ENTITY_IMPORT(DefaultTenantProfileConfiguration::getTenantEntityImportRateLimit),
    NOTIFICATION_REQUESTS(DefaultTenantProfileConfiguration::getTenantNotificationRequestsRateLimit),
    NOTIFICATION_REQUESTS_PER_RULE(DefaultTenantProfileConfiguration::getTenantNotificationRequestsPerRuleRateLimit);

    private final Function<DefaultTenantProfileConfiguration, String> configExtractor;

    public String getLimitConfig(DefaultTenantProfileConfiguration profileConfiguration) {
        return configExtractor.apply(profileConfiguration);
    }

}
