export default function combineContext(...providers){
    return ({children}) => {
        return providers.reduceRight((accumulator,CurrentProvider) => {
            return <CurrentProvider> {accumulator} </CurrentProvider>;
        }, children);
    };
};