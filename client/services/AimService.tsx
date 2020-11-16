import { type } from 'os'

export const createAim = async (name: string, description: string) => {
  return {
    status: 'Success',
    data: { id: Math.floor(Math.random() * Math.floor(1000)), name: 'New Aim' },
  }
  try {
    // const token = localStorage.getItem('TOKEN')
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim`, {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ user_id, name, description ,token  }),
    // })
    // const data = await res.json()
    // if (data.status === 'Success') {
    //   return { status: 'Success', data: data.aim }
    // } else {
    //   throw new Error(data.message)
    // }
  } catch (e) {
    return { status: 'Error', message: e.message }
  }
}

export const editAim = async (name: string, description: string, id: string) => {
  return {
    status: 'Success',
    aim: {
      name,
      id,
    },
  }
  try {
    const token = localStorage.getItem('TOKEN')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, token, aim_id: id }),
    })
    const data = await res.json()

    if (data.status === 'Success') {
      return { status: 'Success', data: data.aim }
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    return { status: 'Error', message: e.message }
  }
}

export const deleteAim = async (id: string) => {
  return { status: 'Success' }
  try {
    const token = localStorage.getItem('TOKEN')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, aim_id: id }),
    })
    const data = await res.json()

    if (data.status === 'Success') {
      return { status: 'Success' }
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    return { status: 'Error', message: e.message }
  }
}

export const getAim = async (id: string) => {
  return {
    status: 'Success',
    aim: {
      name: 'Journal',
      id: '02934',
    },
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/aims/${id}`)
    const data = await res.json()

    if (data.status === 'Success') {
      return { status: 'Success', aim: data.aim }
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return { status: 'Error', message: e.message }
    }
  }
}

export const getAims = async () => {
  try {
    return [
      {
        name: 'Journal',
        id: '02934',
      },
    ]
    const id = localStorage.getItem('USER_ID')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/aims/${id}`)
    const data = await res.json()

    if (data.status === 'Success') {
      return { status: 'Success', aims: data.aims }
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return { status: 'Error', message: e.message }
    }
  }
}
