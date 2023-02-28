export default interface CommandInterface {
    name: string,
    description: string,
    executor: Function
}