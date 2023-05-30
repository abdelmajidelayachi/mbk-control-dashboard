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
package org.thingsboard.server.dao;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.thingsboard.server.dao.util.SqlTsOrTsLatestAnyDao;
import org.thingsboard.server.dao.util.TbAutoConfiguration;

@Configuration
@TbAutoConfiguration
@EnableJpaRepositories({"org.thingsboard.server.dao.sqlts.dictionary"})
@EntityScan({"org.thingsboard.server.dao.model.sqlts.dictionary"})
@EnableTransactionManagement
@SqlTsOrTsLatestAnyDao
public class SqlTimeseriesDaoConfig {

}
