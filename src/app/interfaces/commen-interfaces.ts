export type DateInput = { month: number, year: number, day: number }
export type DateRange = { from: Date, to: Date }

export type Pagination = {
    cursor?: any
    skip?: number
    take?: number,
}
