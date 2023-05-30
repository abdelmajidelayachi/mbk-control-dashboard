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
package org.thingsboard.server.common.transport.adaptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class JsonConverterConfig {

    @Value("${transport.json.type_cast_enabled:true}")
    public void setIsJsonTypeCastEnabled(boolean jsonTypeCastEnabled) {
        JsonConverter.setTypeCastEnabled(jsonTypeCastEnabled);
        log.info("JSON type cast enabled = {}", jsonTypeCastEnabled);
    }

    @Value("${transport.json.max_string_value_length:0}")
    public void setMaxStringValueLength(int maxStringValueLength) {
        JsonConverter.setMaxStringValueLength(maxStringValueLength);
        log.info("JSON max string value length = {}", maxStringValueLength);
    }
}
