// import {LocaleConfig} from 'react-native-calendars';
import React, {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { useTheme } from 'react-native-paper';


LocaleConfig.locales['uk'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: "Today"
};

LocaleConfig.defaultLocale = 'uk';


const CalendarView = () => {
  const [selected, setSelected] = useState('');
  const theme=useTheme();
  return (
    <Calendar style={{backgroundColor:theme.colors.surfaceVariant}}
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{ 
        [selected]: {selected: true, marked: true, disableTouchEvent: true, color: theme.colors.onSurface, selectedDotColor: theme.colors.onSurface}
      }}
    />
  );
};

export default CalendarView;