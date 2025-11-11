import type { DatePickerProps } from 'ant-design-vue';

type ZonedDatePickerProps = DatePickerProps & {
  timezone?: string;
};

export type { ZonedDatePickerProps };
