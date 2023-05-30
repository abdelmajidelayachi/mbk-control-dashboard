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
package org.thingsboard.server.transport.lwm2m.server.downlink;

import lombok.Builder;
import lombok.Getter;
import org.thingsboard.server.transport.lwm2m.server.LwM2MOperationType;

public class TbLwM2MCancelAllRequest implements TbLwM2MDownlinkRequest<Integer> {

    @Getter
    private final long timeout;

    @Builder
    private TbLwM2MCancelAllRequest(long timeout) {
        this.timeout = timeout;
    }

    @Override
    public LwM2MOperationType getType() {
        return LwM2MOperationType.OBSERVE_CANCEL_ALL;
    }

}