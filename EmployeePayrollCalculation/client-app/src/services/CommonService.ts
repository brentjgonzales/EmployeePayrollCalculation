// https://stackoverflow.com/a/2901298/5573838
const numberWithCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CommonService = {
    toMoney: (num: number) => {
        return numberWithCommas((num).toFixed(2));
    }
};

export default CommonService;