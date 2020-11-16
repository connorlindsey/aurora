import moment from 'moment'
import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styled from 'styled-components'

// TODO: Replace moment with a lighter API
const DotCalendar = () => {
  const [date, setDate] = useState(moment())

  // Date Selection
  const jumpToToday = () => setDate(moment())
  const decMonth = () => setDate(moment(date).set('month', date.month() - 1))
  const incMonth = () => setDate(moment(date).set('month', date.month() + 1))
  const getMonthYear = () => {
    const month = date.format('MMM')
    const year = moment().year() === date.year() ? '' : date.format('YY')
    return `${month} ${year}`
  }

  // Get Calendar
  const weekdayshort = moment.weekdaysShort()
  const weekdayshortname = weekdayshort.map((day) => {
    return (
      <div key={day} className="day-of-week">
        {day[0]}
      </div>
    )
  })

  const firstDayOfMonth = () => {
    return moment(date).startOf('month').format('d')
  }

  let blanks = []
  for (let i = 0; i < +firstDayOfMonth(); i++) {
    blanks.push(<div key={i * 10}>{''}</div>)
  }

  const getDaysInMonth = () => {
    return date.daysInMonth()
  }

  const getCurrentDay = () => {
    return date.format('D')
  }

  let daysInMonth = []
  for (let d = 1; d <= getDaysInMonth(); d++) {
    // TODO: Set class based on completion or future
    let currentDay = d === +getCurrentDay() ? 'today' : ''
    const status = Math.random() > 0.88 ? 'INCOMPLETE' : 'COMPLETE'
    daysInMonth.push(<Dot key={d} status={status} />)
  }

  let totalSlots = [...blanks, ...daysInMonth]
  let rows = []
  let cells = []

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row) // if index not equal 7 that means not go to next week
    } else {
      rows.push(cells) // when reach next week we contain all td in last week to rows
      cells = [] // empty container
      cells.push(row) // in current loop we still push current row to new container
    }
    if (i === totalSlots.length - 1) {
      // when end loop we add remain date
      rows.push(cells)
    }
  })

  let month = rows.map((d, i) => {
    return d
  })

  return (
    <Wrapper>
      <MonthSelector>
        <FiChevronLeft onClick={decMonth} />
        <div onClick={jumpToToday}>{getMonthYear()}</div>
        <FiChevronRight onClick={incMonth} />
      </MonthSelector>
      <Calendar>
        {weekdayshortname}
        {month}
      </Calendar>
    </Wrapper>
  )
}

export default DotCalendar

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1rem;
  align-items: center;
  justify-items: center;
  padding: 1rem;

  .day-of-week {
    color: ${(props) => props.theme.grey['300']};
  }
`

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  margin: 4px;
  background-color: ${(props) =>
    props.status === 'COMPLETE' ? props.theme.primary['500'] : props.theme.error['500']};
`

const MonthSelector = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.25rem;
  width: 200px;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 16px;
  color: ${(props) => props.theme.grey['100']};
  user-select: none;

  div {
    cursor: pointer;
  }

  svg {
    height: 24px;
    width: 24px;
    color: ${(props) => props.theme.grey['400']};
    cursor: pointer;
  }
`
