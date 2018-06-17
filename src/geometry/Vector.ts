export abstract class Vector {
    public coordinates: number[]

    public constructor(...coordinates: number[]) {
        this.coordinates = coordinates
    }
}
