"use strict";
globalThis["webpackHotUpdate_ugandaemr_esm_patient_queues_app"]("main",{

/***/ "./src/active-visits/move-to-next-service-point.workspace.tsx":
/*!********************************************************************!*\
  !*** ./src/active-visits/move-to-next-service-point.workspace.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @carbon/react */ "../../node_modules/@carbon/react/es/index.js");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _hooks_useQueueRooms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useQueueRooms */ "./src/hooks/useQueueRooms.ts");
/* harmony import */ var _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./move-to-next-service-point.scss */ "./src/active-visits/move-to-next-service-point.scss");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.tsx");
/* harmony import */ var _patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./patient-queues.resource */ "./src/active-visits/patient-queues.resource.ts");
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-hook-form */ "../../node_modules/react-hook-form/dist/index.esm.mjs");
/* harmony import */ var _hookform_resolvers_zod__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @hookform/resolvers/zod */ "./node_modules/@hookform/resolvers/zod/dist/zod.mjs");
/* harmony import */ var _patient_queue_validation_schema_resource__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./patient-queue-validation-schema.resource */ "./src/active-visits/patient-queue-validation-schema.resource.ts");
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../helpers/helpers */ "./src/helpers/helpers.tsx");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}












var MoveToNextServicePointForm = function(param) {
    var closeWorkspace = param.closeWorkspace, patientUuid = param.workspaceProps.patientUuid;
    var _sessionUser_sessionLocation, _queueRoomLocations_, _sessionUser_user, _sessionUser_sessionLocation1, _queueRoomLocations_1, _sessionUser_sessionLocation2, _providers_, _sessionUser_currentProvider;
    // Hooks
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)().t;
    var isTablet = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useLayoutType)() === 'tablet';
    var sessionUser = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useSession)();
    var patientQueueUuid = (0,_helpers_helpers__WEBPACK_IMPORTED_MODULE_11__.getSelectedPatientQueueUuid)().getState();
    // States
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(), 2), queueEntry = _useState[0], setQueueEntry = _useState[1];
    var _useState1 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1), 2), contentSwitcherIndex = _useState1[0], setContentSwitcherIndex = _useState1[1];
    var _useState2 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1), 2), statusSwitcherIndex = _useState2[0], setStatusSwitcherIndex = _useState2[1];
    var _useState3 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), 2), status = _useState3[0], setStatus = _useState3[1];
    var _useState4 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), 2), provider = _useState4[0], setProvider = _useState4[1];
    var _useState5 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), 2), selectedProvider = _useState5[0], setSelectedProvider = _useState5[1];
    var _useState6 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), 2), priorityComment = _useState6[0], setPriorityComment = _useState6[1];
    var _useState7 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), 2), comment = _useState7[0], setComment = _useState7[1];
    var _useState8 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true), 2), isLoading = _useState8[0], setIsLoading = _useState8[1];
    var _useState9 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), 2), isSubmitting = _useState9[0], setIsSubmitting = _useState9[1];
    // Data Fetching Hooks
    var _useQueueRoomLocations = (0,_hooks_useQueueRooms__WEBPACK_IMPORTED_MODULE_4__.useQueueRoomLocations)(sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_sessionLocation = sessionUser.sessionLocation) === null || _sessionUser_sessionLocation === void 0 ? void 0 : _sessionUser_sessionLocation.uuid), queueRoomLocations = _useQueueRoomLocations.queueRoomLocations, errorLoadingQueueRooms = _useQueueRoomLocations.error;
    var _useState10 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((_queueRoomLocations_ = queueRoomLocations[0]) === null || _queueRoomLocations_ === void 0 ? void 0 : _queueRoomLocations_.uuid), 2), selectedNextQueueLocation = _useState10[0], setSelectedNextQueueLocation = _useState10[1];
    var _useProviders = (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.useProviders)(selectedNextQueueLocation), providers = _useProviders.providers, errorLoadingProviders = _useProviders.error;
    // Memoized constants
    var priorityLabels = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return [
            'Not Urgent',
            'Urgent',
            'Emergency'
        ];
    }, []);
    var statusLabels = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return [
            {
                status: 'pending',
                label: 'Move to Pending'
            },
            {
                status: 'completed',
                label: 'Move to Completed'
            }
        ];
    }, []);
    // Fetch provider info
    var fetchProvider = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        var _sessionUser_user;
        if (!(sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_user = sessionUser.user) === null || _sessionUser_user === void 0 ? void 0 : _sessionUser_user.uuid)) return;
        setIsLoading(true);
        (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.getCareProvider)(sessionUser.user.uuid).then(function(response) {
            var _response_data_results_, _response_data_results, _response_data;
            var uuid = response === null || response === void 0 ? void 0 : (_response_data = response.data) === null || _response_data === void 0 ? void 0 : (_response_data_results = _response_data.results) === null || _response_data_results === void 0 ? void 0 : (_response_data_results_ = _response_data_results[0]) === null || _response_data_results_ === void 0 ? void 0 : _response_data_results_.uuid;
            setProvider(uuid);
        }).catch(function(error) {
            var errorMessages = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.extractErrorMessagesFromResponse)(error);
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showNotification)({
                title: "Couldn't get provider",
                kind: 'error',
                critical: true,
                description: errorMessages.join(','),
                millis: 3000
            });
        }).finally(function() {
            return setIsLoading(false);
        });
    }, [
        sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_user = sessionUser.user) === null || _sessionUser_user === void 0 ? void 0 : _sessionUser_user.uuid
    ]);
    // Fetch queue entry
    var fetchQueueEntry = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        return _async_to_generator(function() {
            var response, error, errorMessages;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.getPatientQueueUuid)(patientQueueUuid.patientQueueUuid)
                        ];
                    case 1:
                        response = _state.sent();
                        if ((response === null || response === void 0 ? void 0 : response.status) === 200 && (response === null || response === void 0 ? void 0 : response.data)) {
                            setQueueEntry(response.data);
                        } else {
                            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showNotification)({
                                title: 'Queue entry not found',
                                kind: 'warning',
                                description: 'The server did not return a valid queue entry.',
                                critical: true,
                                millis: 3000
                            });
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        errorMessages = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.extractErrorMessagesFromResponse)(error);
                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showNotification)({
                            title: "Couldn't get queue entry",
                            kind: 'error',
                            critical: true,
                            description: errorMessages.join(', '),
                            millis: 3000
                        });
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    }, [
        patientQueueUuid
    ]);
    // Effects
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        fetchProvider();
    }, [
        fetchProvider
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        if (patientQueueUuid) {
            fetchQueueEntry();
        }
    }, [
        patientQueueUuid,
        fetchQueueEntry
    ]);
    var _useForm = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_8__.useForm)({
        mode: 'all',
        resolver: (0,_hookform_resolvers_zod__WEBPACK_IMPORTED_MODULE_9__.zodResolver)(_patient_queue_validation_schema_resource__WEBPACK_IMPORTED_MODULE_10__.createQueueEntrySchema),
        defaultValues: {
            priorityComment: priorityLabels[contentSwitcherIndex],
            status: statusLabels[statusSwitcherIndex].status
        }
    }), handleSubmit = _useForm.handleSubmit, control = _useForm.control, errors = _useForm.formState.errors;
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        setPriorityComment(priorityLabels[contentSwitcherIndex]);
    }, [
        contentSwitcherIndex,
        priorityLabels
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        setStatus(statusLabels[statusSwitcherIndex].status);
    }, [
        statusSwitcherIndex,
        statusLabels
    ]);
    var handleSave = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        return _async_to_generator(function() {
            var _sessionUser_sessionLocation, _patientQueueEntryResponse_data_results_, _patientQueueEntryResponse_data, patientQueueEntryResponse, queues, queueEntry, _queueEntry_, _queueEntry_1, _sessionUser_sessionLocation1, _createQueueResponse_data, request, createQueueResponse, response, _getSessionStore_getState_session_user, _getSessionStore_getState_session, _roles_, roles, roleName, error, errorMessages;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            8,
                            ,
                            9
                        ]);
                        setIsSubmitting(true);
                        return [
                            4,
                            (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.getCurrentPatientQueueByPatientUuid)(patientUuid, sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_sessionLocation = sessionUser.sessionLocation) === null || _sessionUser_sessionLocation === void 0 ? void 0 : _sessionUser_sessionLocation.uuid)
                        ];
                    case 1:
                        patientQueueEntryResponse = _state.sent();
                        queues = (_patientQueueEntryResponse_data = patientQueueEntryResponse.data) === null || _patientQueueEntryResponse_data === void 0 ? void 0 : (_patientQueueEntryResponse_data_results_ = _patientQueueEntryResponse_data.results[0]) === null || _patientQueueEntryResponse_data_results_ === void 0 ? void 0 : _patientQueueEntryResponse_data_results_.patientQueues;
                        queueEntry = queues === null || queues === void 0 ? void 0 : queues.filter(function(item) {
                            var _item_patient;
                            return (item === null || item === void 0 ? void 0 : (_item_patient = item.patient) === null || _item_patient === void 0 ? void 0 : _item_patient.uuid) === patientUuid;
                        });
                        if (!(status === _utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Pending)) return [
                            3,
                            3
                        ];
                        if (!(queueEntry.length > 0)) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.updateQueueEntry)(status, provider, (_queueEntry_ = queueEntry[0]) === null || _queueEntry_ === void 0 ? void 0 : _queueEntry_.uuid, 0, priorityComment, comment).then(function() {
                                var _getSessionStore_getState_session_user, _getSessionStore_getState_session, _roles_;
                                (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showSnackbar)({
                                    title: t('moveToNextServicePoint', 'Move back your service point'),
                                    kind: 'success',
                                    subtitle: t('backToQueue', 'Successfully moved back patient to your service point'),
                                    autoClose: true
                                });
                                closeWorkspace();
                                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.handleMutate)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.restBaseUrl, "/patientqueue"));
                                setIsSubmitting(false);
                                var roles = (_getSessionStore_getState_session = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.getSessionStore)().getState().session) === null || _getSessionStore_getState_session === void 0 ? void 0 : (_getSessionStore_getState_session_user = _getSessionStore_getState_session.user) === null || _getSessionStore_getState_session_user === void 0 ? void 0 : _getSessionStore_getState_session_user.roles;
                                var roleName = (_roles_ = roles[0]) === null || _roles_ === void 0 ? void 0 : _roles_.display;
                                if (roles && (roles === null || roles === void 0 ? void 0 : roles.length) > 0) {
                                    if ((roles === null || roles === void 0 ? void 0 : roles.filter(function(item) {
                                        return (item === null || item === void 0 ? void 0 : item.display) === 'Organizational: Clinician';
                                    }).length) > 0) {
                                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.navigate)({
                                            to: "".concat(window.getOpenmrsSpaBase(), "home/clinical-room-patient-queues")
                                        });
                                    } else if (roleName === 'Triage') {
                                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.navigate)({
                                            to: "".concat(window.getOpenmrsSpaBase(), "home/triage-patient-queues")
                                        });
                                    } else {
                                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.navigate)({
                                            to: "".concat(window.getOpenmrsSpaBase(), "home")
                                        });
                                    }
                                }
                            })
                        ];
                    case 2:
                        _state.sent();
                        _state.label = 3;
                    case 3:
                        if (!(status === _utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Completed)) return [
                            3,
                            7
                        ];
                        if (!(queueEntry.length > 0)) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.updateQueueEntry)(_utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Completed, provider, (_queueEntry_1 = queueEntry[0]) === null || _queueEntry_1 === void 0 ? void 0 : _queueEntry_1.uuid, contentSwitcherIndex, priorityComment, comment)
                        ];
                    case 4:
                        _state.sent();
                        request = {
                            patient: patientUuid,
                            provider: selectedProvider !== null && selectedProvider !== void 0 ? selectedProvider : '',
                            locationFrom: sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_sessionLocation1 = sessionUser.sessionLocation) === null || _sessionUser_sessionLocation1 === void 0 ? void 0 : _sessionUser_sessionLocation1.uuid,
                            locationTo: selectedNextQueueLocation,
                            status: _utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Pending,
                            priority: contentSwitcherIndex,
                            priorityComment: priorityComment,
                            comment: comment,
                            queueRoom: selectedNextQueueLocation
                        };
                        return [
                            4,
                            (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.addQueueEntry)(request)
                        ];
                    case 5:
                        createQueueResponse = _state.sent();
                        return [
                            4,
                            (0,_patient_queues_resource__WEBPACK_IMPORTED_MODULE_7__.updateQueueEntry)(_utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Pending, provider, (_createQueueResponse_data = createQueueResponse.data) === null || _createQueueResponse_data === void 0 ? void 0 : _createQueueResponse_data.uuid, contentSwitcherIndex, priorityComment, comment)
                        ];
                    case 6:
                        response = _state.sent();
                        if (response.status === 200) {
                            ;
                            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showSnackbar)({
                                title: t('moveToNextServicePoint', 'Move to next service point'),
                                kind: 'success',
                                subtitle: t('movetonextservicepoint', 'Moved to next service point successfully'),
                                autoClose: true
                            });
                            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.handleMutate)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.restBaseUrl, "/patientqueue"));
                            closeWorkspace();
                            setIsSubmitting(false);
                            // view patient summary
                            // navigate({ to: `\${openmrsSpaBase}/home` });
                            roles = (_getSessionStore_getState_session = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.getSessionStore)().getState().session) === null || _getSessionStore_getState_session === void 0 ? void 0 : (_getSessionStore_getState_session_user = _getSessionStore_getState_session.user) === null || _getSessionStore_getState_session_user === void 0 ? void 0 : _getSessionStore_getState_session_user.roles;
                            roleName = (_roles_ = roles[0]) === null || _roles_ === void 0 ? void 0 : _roles_.display;
                            if (roles && (roles === null || roles === void 0 ? void 0 : roles.length) > 0) {
                                if ((roles === null || roles === void 0 ? void 0 : roles.filter(function(item) {
                                    return (item === null || item === void 0 ? void 0 : item.display) === 'Organizational: Clinician';
                                }).length) > 0) {
                                    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.navigate)({
                                        to: "".concat(window.getOpenmrsSpaBase(), "home/clinical-room-patient-queues")
                                    });
                                } else if (roleName === 'Triage') {
                                    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.navigate)({
                                        to: "".concat(window.getOpenmrsSpaBase(), "home/triage-patient-queues")
                                    });
                                } else {
                                    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.navigate)({
                                        to: "".concat(window.getOpenmrsSpaBase(), "home")
                                    });
                                }
                            }
                        }
                        _state.label = 7;
                    case 7:
                        return [
                            3,
                            9
                        ];
                    case 8:
                        error = _state.sent();
                        setIsSubmitting(false);
                        errorMessages = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.extractErrorMessagesFromResponse)(error);
                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showNotification)({
                            title: t('moveToNextServicePoint', 'Error moving to next service point'),
                            kind: 'error',
                            critical: true,
                            description: errorMessages.join(','),
                            millis: 3000
                        });
                        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.handleMutate)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.restBaseUrl, "/patientqueue"));
                        closeWorkspace();
                        return [
                            3,
                            9
                        ];
                    case 9:
                        return [
                            2
                        ];
                }
            });
        })();
    }, [
        closeWorkspace,
        contentSwitcherIndex,
        patientUuid,
        priorityComment,
        provider,
        selectedNextQueueLocation,
        selectedProvider,
        sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_sessionLocation1 = sessionUser.sessionLocation) === null || _sessionUser_sessionLocation1 === void 0 ? void 0 : _sessionUser_sessionLocation1.uuid,
        status,
        comment,
        t
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].container
    }, isLoading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.InlineLoading, {
        description: 'Fetching Provider..'
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].body
    }, Object.keys(errors).length > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].errorMessage
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null, Object.entries(errors).map(function(param) {
        var _param = _sliced_to_array(param, 2), key = _param[0], error = _param[1];
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
            key: key
        }, key, ": ", error === null || error === void 0 ? void 0 : error.message);
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].section
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].sectionTitle
    }, t('priority', 'Priority')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
        name: "priorityComment",
        control: control,
        render: function(param) {
            var field = param.field;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.ContentSwitcher, _object_spread_props(_object_spread({}, field), {
                size: "md",
                selectedIndex: contentSwitcherIndex,
                className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].contentSwitcher,
                onChange: function(param) {
                    var index = param.index;
                    field.onChange(priorityLabels[index]);
                    setContentSwitcherIndex(index);
                }
            }), priorityLabels.map(function(label, index) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Switch, {
                    key: index,
                    name: label.toLowerCase().replace(/\s+/g, ''),
                    text: t(label.toLowerCase(), label)
                });
            })), errors.priorityComment && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
                className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].errorMessage
            }, errors.priorityComment.message));
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].section
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].sectionTitle
    }, t('status', 'Status')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
        name: "status",
        control: control,
        render: function(param) {
            var field = param.field;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.ContentSwitcher, _object_spread_props(_object_spread({}, field), {
                size: "md",
                selectedIndex: statusSwitcherIndex,
                className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].contentSwitcher,
                onChange: function(param) {
                    var index = param.index;
                    field.onChange(statusLabels[index].status);
                    setStatusSwitcherIndex(index);
                }
            }), statusLabels.map(function(status, index) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Switch, {
                    key: index,
                    name: status.label.toLowerCase().replace(/\s+/g, ''),
                    text: t(status.label.toLowerCase(), status.label)
                });
            })), errors.status && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
                className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].errorMessage
            }, errors.status.message));
        }
    })), status === _utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Completed && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].section
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].sectionTitle
    }, t('nextServicePoint', 'Next service point')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ResponsiveWrapper, {
        isTablet: isTablet
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
        name: "locationTo",
        control: control,
        defaultValue: ((_queueRoomLocations_1 = queueRoomLocations[0]) === null || _queueRoomLocations_1 === void 0 ? void 0 : _queueRoomLocations_1.uuid) || (sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_sessionLocation2 = sessionUser.sessionLocation) === null || _sessionUser_sessionLocation2 === void 0 ? void 0 : _sessionUser_sessionLocation2.uuid),
        render: function(param) {
            var field = param.field;
            var _errors_locationTo;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Select, _object_spread_props(_object_spread({}, field), {
                id: "nextQueueLocation",
                name: "nextQueueLocation",
                labelText: "",
                disabled: errorLoadingQueueRooms,
                invalid: !!errors.locationTo,
                invalidText: (_errors_locationTo = errors.locationTo) === null || _errors_locationTo === void 0 ? void 0 : _errors_locationTo.message,
                value: field.value,
                onChange: function(e) {
                    var selectedValue = e.target.value;
                    field.onChange(selectedValue);
                    setSelectedNextQueueLocation(selectedValue);
                }
            }), !field.value && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.SelectItem, {
                value: "",
                text: t('selectNextServicePoint', 'Choose next service point')
            }), queueRoomLocations.map(function(param) {
                var uuid = param.uuid, display = param.display;
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.SelectItem, {
                    key: uuid,
                    value: uuid,
                    text: display
                });
            }));
        }
    }), errorLoadingQueueRooms && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.InlineNotification, {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].errorNotification,
        kind: "error",
        title: t('errorFetchingQueueRooms', 'Error fetching queue rooms'),
        subtitle: errorLoadingQueueRooms,
        onClick: function() {}
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].section
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].sectionTitle
    }, t('selectAProvider', 'Select a provider')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ResponsiveWrapper, {
        isTablet: isTablet
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
        name: "provider",
        control: control,
        defaultValue: ((_providers_ = providers[0]) === null || _providers_ === void 0 ? void 0 : _providers_.uuid) || (sessionUser === null || sessionUser === void 0 ? void 0 : (_sessionUser_currentProvider = sessionUser.currentProvider) === null || _sessionUser_currentProvider === void 0 ? void 0 : _sessionUser_currentProvider.uuid),
        render: function(param) {
            var field = param.field;
            var _errors_provider;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Select, _object_spread_props(_object_spread({}, field), {
                labelText: '',
                id: "providers-list",
                name: "providers-list",
                disabled: isLoading,
                invalid: !!errors.provider,
                invalidText: (_errors_provider = errors.provider) === null || _errors_provider === void 0 ? void 0 : _errors_provider.message,
                value: field.value,
                onChange: function(event) {
                    field.onChange(event.target.value);
                    setSelectedProvider(event.target.value);
                }
            }), !field.value ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.SelectItem, {
                text: t('selectProvider', 'choose a provider'),
                value: ""
            }) : null, providers.map(function(provider) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.SelectItem, {
                    key: provider.uuid,
                    text: provider.display,
                    value: provider.uuid
                }, provider.display);
            }));
        }
    }), errorLoadingProviders && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.InlineNotification, {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].errorNotification,
        kind: "error",
        title: t('errorFetchingQueueRooms', 'Error fetching providers'),
        subtitle: t('errorLoadingPatientWorkspace', 'Error loading patient workspace {{errorMessage}}', {
            errorMessage: errorLoadingProviders === null || errorLoadingProviders === void 0 ? void 0 : errorLoadingProviders.message
        }),
        onClick: function() {}
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].section
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].sectionTitle
    }, t('notes', 'Notes')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ResponsiveWrapper, {
        isTablet: isTablet
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
        name: "comment",
        control: control,
        render: function(param) {
            var field = param.field;
            var _errors_comment;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.TextArea, _object_spread_props(_object_spread({}, field), {
                "aria-label": t('comment', 'Comment'),
                id: "comment",
                labelText: "",
                invalid: !!errors.comment,
                invalidText: (_errors_comment = errors.comment) === null || _errors_comment === void 0 ? void 0 : _errors_comment.message,
                maxCount: 500,
                enableCounter: true,
                value: field.value,
                onChange: function(e) {
                    field.onChange(e.target.value);
                    setComment(e.target.value);
                }
            }));
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.ButtonSet, {
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].buttonSet
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
        kind: "secondary",
        onClick: function() {
            return closeWorkspace();
        },
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].button
    }, t('cancel', 'Cancel')), isSubmitting ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.InlineLoading, {
        description: 'Submitting...'
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: !provider || isLoading || isSubmitting,
        type: "submit",
        onClick: handleSubmit(handleSave),
        className: _move_to_next_service_point_scss__WEBPACK_IMPORTED_MODULE_5__["default"].button
    }, status === _utils_utils__WEBPACK_IMPORTED_MODULE_6__.QueueStatus.Pending ? 'Save' : 'Move to the next queue room')));
};
function ResponsiveWrapper(param) {
    var children = param.children, isTablet = param.isTablet;
    return isTablet ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Layer, null, children) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, children);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MoveToNextServicePointForm);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("75e88ad201564997")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=main.3d7a0179ed6ae4cb.hot-update.js.map