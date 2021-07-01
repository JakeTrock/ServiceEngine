import * as React from "react";
import axios from "axios";
import { logout } from "./data/helpers";

import { profDetails } from "./data/interfaces";
import { ToastContainer, toast } from 'react-toastify';
import '../data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
// consts

// markup
const dashPage = ({ match, location, history }) => {
    //stores relevant user details
    const [profDetails, setProfDetails] = React.useState<profDetails>({
        utils: [],
        username: ""
    });

    //load user from stored token when page loads
    React.useEffect(() => {
        const tkn = JSON.parse(localStorage.getItem("tk"));
        if (tkn) {
            //TODO: how do I get a user using gql get all user posts/get name from user token
                // .then((itm) => setProfDetails({
                //     utils: itm.data.utils,
                //     username: itm.data.username
                // }))
                // .catch((e) => toast(e));
        }
    }, []);

    //logs out and reloads
    const logout = () => {
        localStorage.removeItem("tk");
        window.location.reload();
    }
    return (
        <div id="holder">
            <ToastContainer />
            <img
                alt="ServiceEngine Logo"
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMiIKICAgd2lkdGg9IjY0IgogICBoZWlnaHQ9IjY0IgogICB2aWV3Qm94PSIwIDAgNjQgNjQiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNlTG9nby5wbmcuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMSAoM2JjMmU4MTNmNSwgMjAyMC0wOS0wNykiPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTgiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIzNy40MzI0NjUiCiAgICAgaW5rc2NhcGU6Y3g9IjM0LjYxNjAwOCIKICAgICBpbmtzY2FwZTpjeT0iMzMuMzg1MzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJnNDgiCiAgICAgaW5rc2NhcGU6c25hcC1pbnRlcnNlY3Rpb24tcGF0aHM9InRydWUiCiAgICAgaW5rc2NhcGU6b2JqZWN0LXBhdGhzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbWlkcG9pbnRzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbm9kZXM9InRydWUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtcm90YXRpb249IjAiCiAgICAgaW5rc2NhcGU6c25hcC1iYm94PSJmYWxzZSIKICAgICBpbmtzY2FwZTpiYm94LW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOmJib3gtcGF0aHM9InRydWUiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzEwIj4KICAgIDxnCiAgICAgICBpZD0iZzUwMTEiCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NS4wODU3OTYsMjcuMjIzOTcpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc1MDM5Ij4KICAgICAgICA8ZwogICAgICAgICAgIGlkPSJnNDgiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC45NTY4MjE2MywwLDAsMC45ODYyNDU5NCwtMy40MTMwNTM2LC0wLjQyMjcwODI0KSI+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc1MDIwIgogICAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMCwxLDEsMCwtODEuNDU2NTI0LC0zNC4zNzIyNzEpIj4KICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6I2YzYmIxMTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgZD0ibSA5LjkwNDUxNjUsNDkuMTE4NDEzIDAuMDg2NDcsLTYuNDI5NjAzIDkuMjQ2ODYwNSw5LjMwMDU0OCB2IDYuNjY2NjY3IHogTSA0NS45MDQ1MTcsMTMuNzI2MzUgViA3LjA1OTY4MjUgbCA5LjMzMzMzLDkuMjE0OTgwNSAtMy4xNzE2MDgsMy4yNzYzMDggeiIKICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzk4IgogICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDxnCiAgICAgICAgICAgICAgIGlkPSJnNTAxNCI+CiAgICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojMWExYjVmO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICAgIGQ9Im0gMTkuMjM3ODQ3LDU1LjMyMjY5MSB2IC0zLjMzMzMzMyBsIDMuMzMzMzQsLTMuMTMxNTA0IDMuMzMzMzMsLTMuMTMxNTA0IHYgMy4zMzMzMzMgMy4zMzMzMzQgbCAtMy4zMzMzMywzLjEzMTUwNCAtMy4zMzMzNCwzLjEzMTUwNCB6IG0gLTkuMjQ2ODYwNSwtMTIuNjMzODg0IDcuOTU2NzcwNSwtNy44NzM3NCA3Ljk1Njc2LC03Ljg3Mzc0IHYgMy4zNDE3MTcgMy4zNDE3MTkgTCAxOS40NTcwMDcsMzkuOTc1MzI0IDEzLjIxMzUsNDUuODk3ODEgWiBNIDM5LjIzNzg0NywzNS40NDEwNDUgdiAtMy4zMzMzMzQgbCA4LC03LjkxNjUyNCA4LC03LjkxNjUyNCB2IDMuMzMzMzM0IDMuMzMzMzMzIGwgLTgsNy45MTY1MjQgLTgsNy45MTY1MjQgeiBtIDAsLTE4Ljc4NTAyIHYgLTMuMzMzMzM0IGwgMy4zMzMzNCwtMy4xMzE1MDUgMy4zMzMzMywtMy4xMzE1MDM1IHYgMy4zMzMzMzQ1IDMuMzMzMzMzIGwgLTMuMzMzMzMsMy4xMzE1MDQgLTMuMzMzMzQsMy4xMzE1MDQgeiIKICAgICAgICAgICAgICAgICBpZD0icGF0aDQ3ODgiCiAgICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICBkPSJtIDI1LjkwNDUxNywyNi45NDEzMyAxMy4zMzMzMyw1LjE2NjM4MSB2IDYuNjY2NjY3IGwgLTEzLjMzMzMzLC01LjE0OTYxMiB6IgogICAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtOSIKICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjYyIgLz4KICAgICAgICAgIDwvZz4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojN2RiNzVkO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgZD0ibSAtNTAuODU3Nzg3LDM1LjE5MTI0MSAtOS4zNzAxMzEsLTkuMzMwNDYgNi41NjI2NzMsLTAuMDAyIDUuODg4OTE3LDYuMjY0NjE3IHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQiCiAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjIiAvPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2M7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjEuMzMzMzMiCiAgICAgICAgICAgICBkPSJtIC0zOC4xMzkxMjQsMTAuNTIwNjcyIDIuMDA3ODk1LC0xLjg1NjQ2NjcgNi4xNjE3MzksNi42NjQxOTQ3IC0yLjAzNzEwNSwxLjg1NDE2NSB6IgogICAgICAgICAgICAgaWQ9InBhdGg0Nzk0LTktNiIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzdkYjc1ZDtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgIGQ9Im0gLTguMjUxNzg1NCwtMC43ODgyMDY3IC05Ljc1MTI3NzYsLTkuMzIyODY1MyAtNi4wMzc5MiwtMC4wMTA3MyA5LjU3MzY4NSw5LjI1ODc0NDAxIHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtMSIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc0OTk4IgogICAgICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTkzLjIyMTc1OSwtMzYuMjg1ODkxLDE3LjczNzUyMikiPgogICAgICAgICAgICA8ZwogICAgICAgICAgICAgICBpZD0iZzUwMDIiPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC01MC40MzY4MjEsMTIuMDA0NDg4IC0yLjgxNTg5LC0zLjM3MjYwODggMC4xNzk4MTgsLTMuMjEyMDY4IDAuMTc5ODIsLTMuMjEyMDY1NCAzLjI1MjE3NSwzLjYzNzkwMDQgMy4yNTIxODMsMy42Mzc5MDEgLTAuNjE2MTEyLDIuOTQ2Nzc1OCAtMC42MTYxMDMsMi45NDY3NzMgeiBtIDE0LjIzOTg4NywtMy44OTM0NzM4IC03LjIyMDYzNywtOC4xODE3OTcyOCAwLjE4MzQwOSwtMy4yNzYyMDgzMiAwLjE4MzQxMSwtMy4yNzYyMDU0IDcuNjUyNTYzLDguNTYwMTg2NiA3LjY1MjU2Myw4LjU2MDE4OTIgLTAuNjE1MzM0LDIuODk3ODE2IC0wLjYxNTMzNiwyLjg5NzgxNiB6IgogICAgICAgICAgICAgICAgIGlkPSJwYXRoNDc4OC0wIgogICAgICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjIiAvPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC0yNS41MDI3MDMsNDAuMjE3OTM4IDYuMTM3NzI1LDYuNTUwNTQgMC40MjQwNDksLTYuMjAxNDgyIC0wLjM1MjA3LC0wLjQxNDU1NiAtMy4yMjk4OCwtMy42NTc3MTggLTIuOTk4ODA2LDAuMjY1MDM2IC0yLjk5ODgwNCwwLjI2NTAyNyB6IG0gNS41NDIyNiwtMTMuNjgyNzI0IDcuMzU3OTMyLDguMTc1NDEzIDMuNDQzNzM2NSwtMy4xODE4MzggLTQuNTc2NTQ3NSwtNS4wNjAxNjYgLTcuNjAwMDk2LC04LjYwNjgwNCAtMi45NTAwOTQsMC4yNzAwMjQgLTIuOTUwMDk0LDAuMjcwMDI1IHoiCiAgICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzg4LTAtMCIKICAgICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo="
            />
            <button onClick={() => logout()}>Log out</button>
            <div id="serviceContainer">
                <h1>{profDetails.username}</h1>
                <div id="resultsHolder">
                    {profDetails.utils.length > 0 && profDetails.utils.map((result, index) => {
                        return (
                            <div id="suggestion" key={index}>
                                <h1>{result.name}</h1>
                                <p>uses:{result.uses}</p>
                                <p>likes:{result.likes}|dislikes:{result.dislikes}</p>
                                <img
                                    alt="edit tool"
                                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjI2LjMzMTUyNG1tIgogICBoZWlnaHQ9IjI2LjMzMTAzbW0iCiAgIHZpZXdCb3g9IjAgMCAyNi4zMzE1MjQgMjYuMzMxMDMiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzgiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMC4yIChlODZjODcwODc5LCAyMDIxLTAxLTE1KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icGVuY2lsLnN2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczIiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJiYXNlIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjMuOTU5Nzk4IgogICAgIGlua3NjYXBlOmN4PSIyNy45OTY5MjIiCiAgICAgaW5rc2NhcGU6Y3k9IjY1LjM4NjcxMSIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iZzg2MiIKICAgICBpbmtzY2FwZTpkb2N1bWVudC1yb3RhdGlvbj0iMCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpzbmFwLW9iamVjdC1taWRwb2ludHM9InRydWUiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGUgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuMjc0NTM1NiwtMS4wMzQzODUxKSI+CiAgICA8ZwogICAgICAgaWQ9Imc4NzciCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi4yNDg2MjgzLC0xLjkyODA3MzQpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc4NjIiCiAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01LjU2ODUxNjcsLTIuNTAyNzgxNikiPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2I5YjliOTtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4yNjQ1ODMiCiAgICAgICAgICAgZD0ibSAyNi43MjUzMDIsMTguMTMyMTA5IDcuNDA2MDIxLC03LjU0MDYyNSAwLjEyMDk3NSwwLjA3Njg4IDAuMTIwOTc1LDAuMDc2ODggLTcuNTI2OTk2LDcuNDYzNzQ3IC03LjUyNjk5Niw3LjQ2Mzc0OCB6IG0gLTMuNzA2NDc4LC0zLjcwNDE2NiA3LjQwNDc4OSwtNy40MDgzMzM1IGggMC4xMzIyOTIgMC4xMzIyOTEgbCAtNy40MDQ3ODksNy40MDgzMzM1IC03LjQwNDc4OSw3LjQwODMzMyBoIC0wLjEzMjI5MiAtMC4xMzIyOTEgeiIKICAgICAgICAgICBpZD0icGF0aDg3NCIgLz4KICAgICAgICA8cGF0aAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNhM2EzYTM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzIgogICAgICAgICAgIGQ9Im0gMjYuMzI2MTE1LDE3LjczNTIzNCA3LjAwNzcxNCwtNy4wMTE0NTggaCAwLjEzMjI5MiAwLjEzMjI5MSBsIC03LjAwNzcxMyw3LjAxMTQ1OCAtNy4wMDc3MTQsNy4wMTE0NTggaCAtMC4xMzIyOTIgLTAuMTMyMjkxIHoiCiAgICAgICAgICAgaWQ9InBhdGg4NzIiIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojOGM4YzhjO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjI2NDU4MyIKICAgICAgICAgICBkPSJNIDkuMjUwNDA0MiwzMS41NjIyMSA5LjEyMjcxNjgsMzEuMjI4OTg0IDkuMTkxNjAzOSwxOC4zOTY2OTIgOS4yNjA0OTEsNS41NjQ0MDEyIEggMjIuMzU3MzY1IDM1LjQ1NDI0IFYgMTguNjYxMjc2IDMxLjc1ODE1IEwgMjIuNDE2MTY2LDMxLjgyNjc5IDkuMzc4MDkxNiwzMS44OTU0MyBaIE0gMzUuMTg5NjU3LDE4LjY2MTI3NiBWIDUuODI4OTg0NSBIIDIyLjM1NzM2NSA5LjUyNTA3NDMgViAxOC42NjEyNzYgMzEuNDkzNTY3IEggMjIuMzU3MzY1IDM1LjE4OTY1NyBaIE0gMTcuMjg1NzAzLDIzLjc3NTUxMSAxNS44OTMxNSwyMi4zNjU0NDIgaCAwLjM5ODg5NSAwLjM5ODg5NCBsIDEuMTY4NTEsMS4xOTA2MjUgMS4xNjg1MSwxLjE5MDYyNSBoIDAuMjc3NTEzIDAuMjc3NTEzIGwgNi45NDM0NCwtNi45NDcxNSA2Ljk0MzQ0LC02Ljk0NzE1IFYgMTAuNTc4NTg5IDEwLjMwNDc4NiBMIDMyLjI3OTI0LDkuMTM2Mjc2MSAzMS4wODg2MTUsNy45Njc3NjYgViA3LjcwMjA3MTQgNy40MzYzNzY4IGwgMS4zMDExNDcsMS4yODE1ODIyIDEuMzAxMTQ4LDEuMjgxNTgyMyAwLjEyMTA5MSwwLjQ2MzA1MzcgMC4xMjEwOTEsMC40NjMwNTQgLTcuMDk0MzQyLDcuMDkwNjkyIC03LjA5NDM0Miw3LjA5MDY5MiAtMC41MzMwNzYsMC4wMzkyNyAtMC41MzMwNzYsMC4wMzkyNyB6IG0gNS44NjU0MTIsLTkuMjE1Mjc3IDcuMjcyNDM0LC03LjI3NjA0MTIgaCAwLjA0NDU0IDAuMDQ0NTQgbCAtMC4wNjA1OSwwLjQxMjgzMiAtMC4wNjA1OSwwLjQxMjgzMiAtNi44NTk0MDIsNi44NjMyMDkyIC02Ljg1OTQwMiw2Ljg2MzIxIGggLTAuMzk2OTc5IC0wLjM5Njk3OSB6IgogICAgICAgICAgIGlkPSJwYXRoODcwIiAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgc3R5bGU9ImZpbGw6Izc2NzY3NjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4yNjQ1ODMiCiAgICAgICAgICAgZD0iTSAzMC4yOTQ4NjUsNy43MDkzNzUyIFYgNy42MDUzOTEgTCAzMC42OTE3NCw3LjQ1MzA5NTggMzEuMDg4NjE1LDcuMzAwODAwNiBWIDcuNTU3MDggNy44MTMzNTk0IEggMzAuNjkxNzQgMzAuMjk0ODY1IFoiCiAgICAgICAgICAgaWQ9InBhdGg4NjgiIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojNjA2MDYwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjI2NDU4MyIKICAgICAgICAgICBkPSJtIDE4LjkxNzc4MiwyNS4yNjAyNDQgdiAtMC4yODAxOTggbCAwLjI2NDU4NCwwLjE2MzUyMSAwLjI2NDU4MywwLjE2MzUyMiB2IDAuMTE2Njc2IDAuMTE2Njc3IGggLTAuMjY0NTgzIGwgLTMuMzA3MjkyLDAuOTI2MDQ3IHogbSAtMy40Mzk1ODMsLTIuOTk4Nzg2IHYgLTAuMTAzOTg0IGwgMC4zOTY4NzUsLTAuMTUyMjk1IDAuMzk2ODc1LC0wLjE1MjI5NiB2IDAuMjU2MjggMC4yNTYyNzkgaCAtMC4zOTY4NzUgbCAtMS4xOTA2MjUsMi44NzM2MTMgeiIKICAgICAgICAgICBpZD0icGF0aDg2NiIKICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgICAgICA8cGF0aAogICAgICAgICAgIHN0eWxlPSJmaWxsOiMzMzMzMzM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzIgogICAgICAgICAgIGQ9Im0gMTQuNjg0NDQ5LDI1LjkzNzMxNyB2IC0wLjY5ODI2MiBsIDAuNTk1MzEzLDAuMDg0NTUgMC41OTUzMTIsMC4wODQ1NSB2IDAuNTI5MTY3IDAuNTI5MTY3IGwgLTAuNTk1MzEyLDAuMDg0NTUgLTAuNTk1MzEzLDAuMDg0NTUgeiIKICAgICAgICAgICBpZD0icGF0aDg2NCIgLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="
                                    onClick={() => history.push('/editor?' + result.uuid)}
                                />
                            </div>
                        );
                    })}
                    <div id="suggestion">
                        <h1>add new tool</h1>
                        <img
                            alt="add new tool"
                            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjI2LjMzMTUyNG1tIgogICBoZWlnaHQ9IjI2LjMzMTAzbW0iCiAgIHZpZXdCb3g9IjAgMCAyNi4zMzE1MjQgMjYuMzMxMDMiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzgiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMC4yIChlODZjODcwODc5LCAyMDIxLTAxLTE1KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icGVuY2lsLnN2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczIiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJiYXNlIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjMuOTU5Nzk4IgogICAgIGlua3NjYXBlOmN4PSIyNy45OTY5MjIiCiAgICAgaW5rc2NhcGU6Y3k9IjY1LjM4NjcxMSIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iZzg2MiIKICAgICBpbmtzY2FwZTpkb2N1bWVudC1yb3RhdGlvbj0iMCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpzbmFwLW9iamVjdC1taWRwb2ludHM9InRydWUiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGUgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuMjc0NTM1NiwtMS4wMzQzODUxKSI+CiAgICA8ZwogICAgICAgaWQ9Imc4NzciCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi4yNDg2MjgzLC0xLjkyODA3MzQpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc4NjIiCiAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01LjU2ODUxNjcsLTIuNTAyNzgxNikiPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2I5YjliOTtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4yNjQ1ODMiCiAgICAgICAgICAgZD0ibSAyNi43MjUzMDIsMTguMTMyMTA5IDcuNDA2MDIxLC03LjU0MDYyNSAwLjEyMDk3NSwwLjA3Njg4IDAuMTIwOTc1LDAuMDc2ODggLTcuNTI2OTk2LDcuNDYzNzQ3IC03LjUyNjk5Niw3LjQ2Mzc0OCB6IG0gLTMuNzA2NDc4LC0zLjcwNDE2NiA3LjQwNDc4OSwtNy40MDgzMzM1IGggMC4xMzIyOTIgMC4xMzIyOTEgbCAtNy40MDQ3ODksNy40MDgzMzM1IC03LjQwNDc4OSw3LjQwODMzMyBoIC0wLjEzMjI5MiAtMC4xMzIyOTEgeiIKICAgICAgICAgICBpZD0icGF0aDg3NCIgLz4KICAgICAgICA8cGF0aAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNhM2EzYTM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzIgogICAgICAgICAgIGQ9Im0gMjYuMzI2MTE1LDE3LjczNTIzNCA3LjAwNzcxNCwtNy4wMTE0NTggaCAwLjEzMjI5MiAwLjEzMjI5MSBsIC03LjAwNzcxMyw3LjAxMTQ1OCAtNy4wMDc3MTQsNy4wMTE0NTggaCAtMC4xMzIyOTIgLTAuMTMyMjkxIHoiCiAgICAgICAgICAgaWQ9InBhdGg4NzIiIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojOGM4YzhjO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjI2NDU4MyIKICAgICAgICAgICBkPSJNIDkuMjUwNDA0MiwzMS41NjIyMSA5LjEyMjcxNjgsMzEuMjI4OTg0IDkuMTkxNjAzOSwxOC4zOTY2OTIgOS4yNjA0OTEsNS41NjQ0MDEyIEggMjIuMzU3MzY1IDM1LjQ1NDI0IFYgMTguNjYxMjc2IDMxLjc1ODE1IEwgMjIuNDE2MTY2LDMxLjgyNjc5IDkuMzc4MDkxNiwzMS44OTU0MyBaIE0gMzUuMTg5NjU3LDE4LjY2MTI3NiBWIDUuODI4OTg0NSBIIDIyLjM1NzM2NSA5LjUyNTA3NDMgViAxOC42NjEyNzYgMzEuNDkzNTY3IEggMjIuMzU3MzY1IDM1LjE4OTY1NyBaIE0gMTcuMjg1NzAzLDIzLjc3NTUxMSAxNS44OTMxNSwyMi4zNjU0NDIgaCAwLjM5ODg5NSAwLjM5ODg5NCBsIDEuMTY4NTEsMS4xOTA2MjUgMS4xNjg1MSwxLjE5MDYyNSBoIDAuMjc3NTEzIDAuMjc3NTEzIGwgNi45NDM0NCwtNi45NDcxNSA2Ljk0MzQ0LC02Ljk0NzE1IFYgMTAuNTc4NTg5IDEwLjMwNDc4NiBMIDMyLjI3OTI0LDkuMTM2Mjc2MSAzMS4wODg2MTUsNy45Njc3NjYgViA3LjcwMjA3MTQgNy40MzYzNzY4IGwgMS4zMDExNDcsMS4yODE1ODIyIDEuMzAxMTQ4LDEuMjgxNTgyMyAwLjEyMTA5MSwwLjQ2MzA1MzcgMC4xMjEwOTEsMC40NjMwNTQgLTcuMDk0MzQyLDcuMDkwNjkyIC03LjA5NDM0Miw3LjA5MDY5MiAtMC41MzMwNzYsMC4wMzkyNyAtMC41MzMwNzYsMC4wMzkyNyB6IG0gNS44NjU0MTIsLTkuMjE1Mjc3IDcuMjcyNDM0LC03LjI3NjA0MTIgaCAwLjA0NDU0IDAuMDQ0NTQgbCAtMC4wNjA1OSwwLjQxMjgzMiAtMC4wNjA1OSwwLjQxMjgzMiAtNi44NTk0MDIsNi44NjMyMDkyIC02Ljg1OTQwMiw2Ljg2MzIxIGggLTAuMzk2OTc5IC0wLjM5Njk3OSB6IgogICAgICAgICAgIGlkPSJwYXRoODcwIiAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgc3R5bGU9ImZpbGw6Izc2NzY3NjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4yNjQ1ODMiCiAgICAgICAgICAgZD0iTSAzMC4yOTQ4NjUsNy43MDkzNzUyIFYgNy42MDUzOTEgTCAzMC42OTE3NCw3LjQ1MzA5NTggMzEuMDg4NjE1LDcuMzAwODAwNiBWIDcuNTU3MDggNy44MTMzNTk0IEggMzAuNjkxNzQgMzAuMjk0ODY1IFoiCiAgICAgICAgICAgaWQ9InBhdGg4NjgiIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojNjA2MDYwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjI2NDU4MyIKICAgICAgICAgICBkPSJtIDE4LjkxNzc4MiwyNS4yNjAyNDQgdiAtMC4yODAxOTggbCAwLjI2NDU4NCwwLjE2MzUyMSAwLjI2NDU4MywwLjE2MzUyMiB2IDAuMTE2Njc2IDAuMTE2Njc3IGggLTAuMjY0NTgzIGwgLTMuMzA3MjkyLDAuOTI2MDQ3IHogbSAtMy40Mzk1ODMsLTIuOTk4Nzg2IHYgLTAuMTAzOTg0IGwgMC4zOTY4NzUsLTAuMTUyMjk1IDAuMzk2ODc1LC0wLjE1MjI5NiB2IDAuMjU2MjggMC4yNTYyNzkgaCAtMC4zOTY4NzUgbCAtMS4xOTA2MjUsMi44NzM2MTMgeiIKICAgICAgICAgICBpZD0icGF0aDg2NiIKICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgICAgICA8cGF0aAogICAgICAgICAgIHN0eWxlPSJmaWxsOiMzMzMzMzM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzIgogICAgICAgICAgIGQ9Im0gMTQuNjg0NDQ5LDI1LjkzNzMxNyB2IC0wLjY5ODI2MiBsIDAuNTk1MzEzLDAuMDg0NTUgMC41OTUzMTIsMC4wODQ1NSB2IDAuNTI5MTY3IDAuNTI5MTY3IGwgLTAuNTk1MzEyLDAuMDg0NTUgLTAuNTk1MzEzLDAuMDg0NTUgeiIKICAgICAgICAgICBpZD0icGF0aDg2NCIgLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="
                            onClick={() => history.push('/editor')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default dashPage;
