export const createAim = async (name: string, description: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, description }),
    })
    const data = await res.json()
    if (data.status === 'Success') {
      return data
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    return { status: 'Error', message: e.message }
  }
}

export const editAim = async (name: string, description: string, id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, aim_id: id }),
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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ aim_id: id }),
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

export const addCompletion = async (aim_id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim/${aim_id}/completion`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    const data = await res.json()

    if (data.status === 'Success') {
      return data
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    return { status: 'Error', message: e.message }
  }
}

export const removeCompletion = async (aim_id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aim/${aim_id}/completion`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    const data = await res.json()

    if (data.status === 'Success') {
      return data
    } else {
      throw new Error(data.message)
    }
  } catch (e) {
    return { status: 'Error', message: e.message }
  }
}
