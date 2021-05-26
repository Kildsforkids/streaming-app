import schedule from 'node-schedule'

const createJob = async (id, date, worker, params) => {
    try {
        schedule.scheduleJob(id, date, () => {
            worker(...params)
        })
    } catch (error) {
        console.log(error.message)
    }
}

const cancelJob = async (id) => {
    try {
        return schedule.cancelJob(id)
    } catch (error) {
        console.log(error.message)
    }
}

export { createJob, cancelJob }