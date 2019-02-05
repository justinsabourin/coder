import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { DirectoryTreeActionTypes } from "./types";
import * as Actions from "./actions";
import callApi from "../../utils/callApi";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT ||
  "/api/projects/users/${creator}/projects/${project_name}/path/${path}?status=true";

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

function* handleAddFile({ payload: AddFile }) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(, "get", API_ENDPOINT, "/heroes");

    if (res.error) {
      yield put(fetchError(res.error));
    } else {
      yield put(fetchSuccess(res));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!));
    } else {
      yield put(fetchError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetchRequest() {
  yield takeEvery(DirectoryTreeActionTypes.ADD_FILE, handleFetch);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* heroesSaga() {
  yield all([fork(watchFetchRequest)]);
}

export default heroesSaga;
