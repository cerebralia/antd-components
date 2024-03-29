/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCheckboxGroupComponent } from './checkbox-group.component';
import { NzCheckboxWrapperComponent } from './checkbox-wrapper.component';
import { NzCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [NzCheckboxComponent, NzCheckboxGroupComponent, NzCheckboxWrapperComponent],
  exports: [NzCheckboxComponent, NzCheckboxGroupComponent, NzCheckboxWrapperComponent]
})
export class NzCheckboxModule {}
