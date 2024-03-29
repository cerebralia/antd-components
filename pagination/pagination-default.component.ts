/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzPaginationItemComponent } from './pagination-item.component';
import { PaginationItemRenderContext } from './pagination.types';

@Component({
  selector: 'ul[nz-pagination-default]',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li class="ant-pagination-total-text" *ngIf="showTotal">
      <ng-template [ngTemplateOutlet]="showTotal" [ngTemplateOutletContext]="{ $implicit: total, range: ranges }"></ng-template>
    </li>
    <li
      *ngFor="let page of listOfPageItem; trackBy: trackByPageItem"
      nz-pagination-item
      [locale]="locale"
      [type]="page.type"
      [index]="page.index"
      [disabled]="page.disabled"
      [itemRender]="itemRender"
      [active]="pageIndex === page.index"
      (gotoIndex)="jumpPage($event)"
      (diffIndex)="jumpDiff($event)"
    ></li>
    <div
      nz-pagination-options
      *ngIf="showQuickJumper || showSizeChanger"
      [total]="total"
      [locale]="locale"
      [disabled]="disabled"
      [nzSize]="nzSize"
      [showSizeChanger]="showSizeChanger"
      [showQuickJumper]="showQuickJumper"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      (pageIndexChange)="onPageIndexChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    ></div>
  `,
  host: {
    '[class.ant-pagination]': 'true',
    '[class.ant-pagination-disabled]': 'disabled',
    '[class.mini]': `nzSize === 'small'`
  }
})
export class NzPaginationDefaultComponent implements OnChanges {
  @Input() nzSize: 'default' | 'small' = 'default';
  @Input() itemRender: TemplateRef<PaginationItemRenderContext>;
  @Input() showTotal: TemplateRef<{ $implicit: number; range: [number, number] }> | null = null;
  @Input() disabled = false;
  @Input() locale: NzSafeAny = {};
  @Input() showSizeChanger = false;
  @Input() showQuickJumper = false;
  @Input() total = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 30, 40];
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  ranges = [0, 0];
  listOfPageItem: Array<Partial<NzPaginationItemComponent>> = [];

  jumpPage(index: number): void {
    this.onPageIndexChange(index);
  }

  jumpDiff(diff: number): void {
    this.jumpPage(this.pageIndex + diff);
  }

  trackByPageItem(_: number, value: Partial<NzPaginationItemComponent>): string {
    return `${value.type}-${value.index}`;
  }

  onPageIndexChange(index: number): void {
    this.pageIndexChange.next(index);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.next(size);
  }

  getLastIndex(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  buildIndexes(): void {
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    this.listOfPageItem = this.getListOfPageItem(this.pageIndex, lastIndex);
  }

  getListOfPageItem(pageIndex: number, lastIndex: number): Array<Partial<NzPaginationItemComponent>> {
    const concatWithPrevNext = (listOfPage: Array<Partial<NzPaginationItemComponent>>) => {
      const prevItem = {
        type: 'prev',
        disabled: pageIndex === 1
      };
      const nextItem = {
        type: 'next',
        disabled: pageIndex === lastIndex
      };
      return [prevItem, ...listOfPage, nextItem];
    };
    const generatePage = (start: number, end: number): Array<Partial<NzPaginationItemComponent>> => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page'
        });
      }
      return list;
    };
    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange = [];
        const prevFiveItem = {
          type: 'prev_5'
        };
        const nextFiveItem = {
          type: 'next_5'
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 5), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 2, selected + 2), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 4, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pageIndex, pageSize, total } = changes;
    if (pageIndex || pageSize || total) {
      this.ranges = [(this.pageIndex - 1) * this.pageSize + 1, Math.min(this.pageIndex * this.pageSize, this.total)];
      this.buildIndexes();
    }
  }
}
