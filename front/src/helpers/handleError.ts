import {appAC} from "../bll/app.slice.ts";
import type {AppDispatchType} from "../bll/store.ts";


export const handleError = (err: unknown, fallbackMessage: string, dispatch: AppDispatchType) => {
    let errorMessage = fallbackMessage;

    try {
        if (typeof err === "string") {
            errorMessage = err;
        } else if (typeof err === "object" && err !== null && "data" in err &&
            typeof (err as any ).data?.message === "string"
        ){
            errorMessage =(err as any).data.message
        } else if (typeof err === "object" && err !== null && "message" in err &&
            typeof (err as any).message === "string"
        ) {
            errorMessage = (err as any).message
        } else {
            errorMessage = JSON.stringify(err)
        }
    } catch {
        errorMessage = 'Failed to parse error'
    }

    dispatch(appAC.changeStatusError(errorMessage))
}

