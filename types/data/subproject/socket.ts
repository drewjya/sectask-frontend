export type SocketSubprojectAction = {
    type: string,
    subproject: {
        subprojectId: number,
        startDate: Date;
        endDate: Date;
        name:string

    }
}