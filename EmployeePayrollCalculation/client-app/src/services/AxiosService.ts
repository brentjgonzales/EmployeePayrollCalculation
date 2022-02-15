import axios, {AxiosResponse} from "axios";
import {Config} from "../utils";
import ToastMaker from "toastmaker";
import {MutableRefObject} from "react";

const config = {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    },
};

function get<T>(url: string,
                success: ((x: T) => any) | null,
                errorMessage: string,
                mountedRef: MutableRefObject<boolean>) {
    axios
        .get<T>(url, config)
        .then(response => {
            if (!mountedRef.current) {
                return;
            }
            if (success) {
                success(response.data);
            }
        })
        .catch((data: any) => {
            if (!mountedRef.current) {
                return;
            }
            ToastMaker(errorMessage);
            console.error(data);
        });
}

function post<T>(url: string,
                 payload: any,
                 success: ((x: T) => any) | null,
                 errorMessage: string,
                 mountedRef: MutableRefObject<boolean>) {
    axios
        .post<T>(url, payload, config)
        .then(response => {
            if (!mountedRef.current) {
                return;
            }
            if (success) {
                success(response.data);
            }
        })
        .catch((data: any) => {
            if (!mountedRef.current) {
                return;
            }
            ToastMaker(errorMessage);
            console.error(data);
        });
}

function put<T>(url: string,
                payload: any,
                success: ((x: T) => any) | null,
                errorMessage: string,
                mountedRef: MutableRefObject<boolean>) {
    axios
        .put<T>(url, payload, config)
        .then(response => {
            if (!mountedRef.current) {
                return;
            }
            if (success) {
                success(response.data);
            }
        })
        .catch((data: any) => {
            if (!mountedRef.current) {
                return;
            }
            ToastMaker(errorMessage);
            console.error(data);
        });
}

function del<T>(url: string,
                success: ((x: T) => any) | null,
                errorMessage: string,
                mountedRef: MutableRefObject<boolean>) {
    axios
        .delete<T>(url, config)
        .then(response => {
            if (!mountedRef.current) {
                return;
            }
            if (success) {
                success(response.data);
            }
        })
        .catch((data: any) => {
            if (!mountedRef.current) {
                return;
            }
            ToastMaker(errorMessage);
            console.error(data);
        });
}

const AxiosService = {
    get: get,
    post: post,
    put: put,
    delete: del
};

export default AxiosService;