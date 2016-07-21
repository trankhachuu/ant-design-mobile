import { PropTypes } from 'react';
import * as React from 'react';
import PopupDatePicker from 'rmc-date-picker/lib/Popup';
import GregorianCalendar from 'gregorian-calendar';
import GregorianCalendarFormat from 'gregorian-calendar-format';
import zhCn from 'gregorian-calendar/lib/locale/zh_CN';
import zhCnPicker from 'rmc-date-picker/lib/locale/zh_CN';
import PopupStyles from './PopupStyles';

const now = new GregorianCalendar(zhCn);
now.setTime(Date.now());

function getFormatter(type) {
  let formatter;
  if (type === 'time') {
    formatter = new GregorianCalendarFormat('HH:mm');
  } else if (type === 'datetime') {
    formatter = new GregorianCalendarFormat('yyyy-MM-dd HH:mm');
  } else {
    formatter = new GregorianCalendarFormat('yyyy-MM-dd');
  }
  return formatter;
}

function getDefaultProps() {
  const defaultFormat = (val) => {
    return val;
  };
  return {
    mode: 'datetime',
    locale: zhCnPicker,
    format: defaultFormat,
    extra: '请选择',
    onChange() {},
    okText: '确定',
    dismissText: '取消',
    title: '',
  };
}

export default class DatePicker extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    mode: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    onChange: PropTypes.func,
    format: PropTypes.func,
  };

  static defaultProps = getDefaultProps();

  constructor(props) {
    super(props);
    this.state = {
      date: props.value && this.getFormatter().parse(props.value, { locale: zhCn }) || now,
      minDate: props.minDate && this.getFormatter().parse(props.minDate, { locale: zhCn }),
      maxDate: props.maxDate && this.getFormatter().parse(props.maxDate, { locale: zhCn }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setState({
        date: nextProps.value && this.getFormatter().parse(nextProps.value, {
          locale: zhCn,
        }) || now,
      });
    }

    if ('minDate' in nextProps && nextProps.minDate !== this.props.minDate) {
      this.setState({
        minDate: nextProps.minDate && this.getFormatter().parse(nextProps.minDate, {
          locale: zhCn,
        }),
      });
    }

    if ('maxDate' in nextProps && nextProps.maxDate !== this.props.maxDate) {
      this.setState({
        maxDate: nextProps.maxDate && this.getFormatter().parse(nextProps.maxDate, {
          locale: zhCn,
        }),
      });
    }
  }
  onChange = (v) => {
    this.props.onChange(this.getFormatter().format(v));
  }
  getFormatter = () => {
    return getFormatter(this.props.mode);
  }
  render() {
    const { date, minDate, maxDate } = this.state;
    const { format, extra, value, okText, dismissText, title, locale } = this.props;
    const extraProps = {
      extra: value ? format(value) : extra,
    };
    return (
      <PopupDatePicker {...this.props}
        styles={PopupStyles}
        locale={locale}
        okText={okText}
        dismissText={dismissText}
        title={title}
        onChange={this.onChange}
        date={date}
        minDate={minDate}
        maxDate={maxDate}
      >
        {React.cloneElement(this.props.children, extraProps)}
      </PopupDatePicker>
    );
  }
}
