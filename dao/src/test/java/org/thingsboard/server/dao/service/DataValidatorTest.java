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
package org.thingsboard.server.dao.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.thingsboard.server.dao.exception.DataValidationException;

public class DataValidatorTest {

    @Test
    public void validateEmail() {
        String email = "aZ1_!#$%&'*+/=?`{|}~^.-@mail.io";
        DataValidator.validateEmail(email);
    }

    @Test
    public void validateInvalidEmail1() {
        String email = "test:1@mail.io";
        Assertions.assertThrows(DataValidationException.class, () -> {
            DataValidator.validateEmail(email);
        });
    }
    @Test
    public void validateInvalidEmail2() {
        String email = "test()1@mail.io";
        Assertions.assertThrows(DataValidationException.class, () -> {
            DataValidator.validateEmail(email);
        });
    }

    @Test
    public void validateInvalidEmail3() {
        String email = "test[]1@mail.io";
        Assertions.assertThrows(DataValidationException.class, () -> {
            DataValidator.validateEmail(email);
        });
    }

    @Test
    public void validateInvalidEmail4() {
        String email = "test\\1@mail.io";
        Assertions.assertThrows(DataValidationException.class, () -> {
            DataValidator.validateEmail(email);
        });
    }

    @Test
    public void validateInvalidEmail5() {
        String email = "test\"1@mail.io";
        Assertions.assertThrows(DataValidationException.class, () -> {
            DataValidator.validateEmail(email);
        });
    }

    @Test
    public void validateInvalidEmail6() {
        String email = "test<>1@mail.io";
        Assertions.assertThrows(DataValidationException.class, () -> {
            DataValidator.validateEmail(email);
        });
    }
}
