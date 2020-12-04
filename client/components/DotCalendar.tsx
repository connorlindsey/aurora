import moment from 'moment'
import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styled from 'styled-components'

// TODO: Replace moment with a lighter API
const DotCalendar = ({ completion, startDate }) => {
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

  let daysInMonth = []
  for (let d = 1; d <= getDaysInMonth(); d++) {
    let status = 'PAST'
    const thisDate = moment(date).set('date', d)
    // console.log(completion.some((c) => thisDate.isSame(c.date, 'day')))
    if (thisDate.isAfter(moment())) {
      status = 'FUTURE'
    } else if (thisDate.isAfter(startDate)) {
      status = 'INCOMPLETE'
    }
    if (completion.some((c) => thisDate.isSame(c.date, 'day'))) {
      status = 'COMPLETE'
    }
    // TODO: Update today on toggle somehow
    daysInMonth.push(<Dot key={d} className={status} />)
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
      <Weekdays>
        <div />
        {weekdayshortname}
      </Weekdays>
      <ScrollWrapper>
        <CalendarWrapper>
          <StickyMonth>{getMonthYear()}</StickyMonth>
          <Grid>{month}</Grid>
        </CalendarWrapper>
      </ScrollWrapper>
    </Wrapper>
  )
}

export default DotCalendar

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const ScrollWrapper = styled.div`
  position: relative;
  overflow-y: auto;
  max-height: 600px;
  /* TODO: Listen for screen resize and set max height as diff between position and screen size + margin */

  /* Hide Scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`
// TODO: Overlay needs to scroll with container
// const Overlay = styled.div`
//   position: relative;
//   border: 3px solid green;
//   height: 600px;

//   .gradient {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     border: 3px solid cyan;
//     background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
//   }
// `

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1rem;
  align-items: center;
  justify-items: center;
`

const Weekdays = styled(Grid)`
  color: ${(props) => props.theme.grey['300']};
  margin: 1rem 0;
  grid-template-columns: 40px repeat(7, 1fr);
`

const StickyMonth = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  text-align: right;
  color: ${(props) => props.theme.grey['300']};
  align-self: flex-start;
  padding-right: 8px;
`

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: 40px auto;
  grid-gap: 1rem;
  :not(:last-child) {
    margin-bottom: 1rem;
  }
`

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  margin: 4px;

  &.FUTURE {
    background-color: ${(props) => props.theme.grey['500']};
  }
  &.COMPLETE {
    background-color: ${(props) => props.theme.primary['500']};
  }
  &.INCOMPLETE {
    background-color: ${(props) => props.theme.error['500']};
  }
  &.PAST {
    background-color: ${(props) => props.theme.grey['700']};
  }
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
