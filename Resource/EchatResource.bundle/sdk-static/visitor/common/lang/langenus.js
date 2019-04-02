var lanRes = {
    colon:':',
    scanchat:'Scan the QR code and chat',
    evaluate:'Satisfaction Evaluation',
    evaluateTitle:{title:'Satisfaction Evaluation'},
    eavlLevel1:'Very dissatisfied',
    eavlLevel2:'Dissatisfied',
    eavlLevel3:'Neutral ',
    eavlLevel4:'Satisfied',
    eavlLevel5:'Very satisfied',
    suggest:'Please give us your advice:',
    suggestHolder:{placeholder:'Suggestions:'},
    submit:'Submit',
    toLeavelWord:'Leave a message',
    viewThisMsg:'View the message',
    writemore:'Write another message',
    leavelWordTip:'After we receive your message, we will contact you immediately',
    leavelSuc:{alt:'The message has been recorded'},
    offlineTip:{alt:'The customer service is offline'},
    leaveWord:'Message',
    validCode:{alt:'Verification Code'},
    validCodeTip:"Please enter the verification code and start to chat.",
    nextPic:'&nbsp;Refresh&nbsp;',
    okay:'Confirm',
    cancel:'Cancel',
    send:'Send',
    close:'Close',
    waitting:'Please wait...',
    prepage:'The previous page',
    nextpage:'The next page',
    sendFail:'Failed to send',
    emotion:{title:'Emotion'},
    emotionHtml:'Emotion',
    file:{title:'File'},
    snapshotTitle:{title:'Paste the copied screenshots and send'},
    fileHtml:'File',
    textareaInput:{placeholder:'Please enter...'},
    title:'E-Chat',    
    endChat:'End the chat',
    endChatTitle:{ title: 'End the chat'},
    sendShortCut1:'Press Enter and send',
    sendShortCut2:'Press Ctrl+Enter and send',
    backToSite:'Go back',
    invildEmail:'Please enter a correct Email address',
    invildPhone:'Please enter a correct phone number',
    invildAge:'Please enter a correct age',
    invildQQ:'Please enter a correct QQ number',
    invildDate:'Please enter the date in the format YY-MM-DD',
    inputPlease:'Please fill in',
    chatContinued:'The chat is connected again',
    offlineForbidTip:'The customer service is offline and message is disable. Please contact us during our regular business hours.',
    leaveWordContent:'Message Content',
    leaveWordFail:'Fail to submit a message',
    male : "M",
    female : "F",
    married : "Y ",
    unmarried : "N",
    receiveBookForm:'An appointment form has been sent to you.',
    submitInfoSucc:'Submit information successfully',
    waitingChat1:'There are',
    waitingChat2:' visitors before you, please wait...',
    toContinueChat:'Click Continue',
    download:'Download',
    staffExitEnding:'The customer service is offline and the chat finishes.',
    tooLargeUploadFail:'The file is too large to upload.',
    unsupportFileType:'The file type is not supported and the upload is failed.',
    unkownErrorUpload:'Upload File Error',
    unkownErrorSubmit:'Fail to submit an information',
    fileSizeOut:'The file is too large, please upload the file less than ',
    unkownErrorSubmitEval:'Submit Failed',
    successSubmitEval:'Submit Sucessfully',
    picture:'Image',
    onlineService:'Online Customer Service',
    intro:'Introduction',
    telephone:'Phone',
    backToChat:'Return to chat',
    makeCall:'Phone Contact',
    newMsgPc:'There is a new message...',
    andLabel:'Chat with ',
    chatWith:'',//Chatting//语句不通顺
    sendPic:'Send an image',
    serviceStaff:'Customer Service ',
    evaluateTimeout:'Unfortunately, because the system times out, you can not continue to make an evaluation!',
    evaluateRepeat:'You have successfully submitted service evaluation, do not repeat the submission, thank you!',
    evaluateRepeatTime:'Unfortunately, because the system times out, you can not continue to make an evaluation!',
    leaveStaffReply:'reply to your message',
    fileSending:'The file is sending...',
    captureSending:'In the screenshot sent...',
    transferStaff:'to serve you',
    staffInput:'Customer service is typing',
    validateCode:'verification code ',
    inputCode:'Please enter the verification code',
    selectFile:'Select file',
    hasUnreadMsgNum:'You have ${num} unread message',
    echatSnap:'echat screenshot',
    fileSendWait:'is sending, please send the request again next',
    supportFileType:'Supported types',
    staffLeaveEnd:"Customer service is offline, the dialogue was over。",
    today:'today',
    yesterday:'yesterday',
    beforeYesterday:'the day before yesterday',
    robot:'Robot',
    robotName:'Intelligent customer service',
    commonQuestion:'FAQ',
    tip:'Tip',
    closeTip:'Are you sure you want to end this chat?',
    capture:'Screenshots',
    captureTitle:{title:"Screenshots"},
    captureHide:'Hide the current window when screenshots',
    captureQQtip:'If you have QQ and other screenshots tools can be directly pasted into the input box to send',
    clickHere:'Click here',
    captureInstall:'Install screenshot plugin of EChat',
    captureInstalling:'Is being installed, click here after the installation is complete ...',
    defaultWnd:'Default',
    interactWnd:'Interactive',
    defautInfoPage:'Default Window',
    interactInfoPage:'Interactive Window',
    preHistory:'See more messages',
    inputPlaceholder:'Please enter text or paste the screenshot',
    textPlaceholder:{
        placeholder:'Please enter text or paste the screenshot'
    },
    inputPlaceholder2:'please enter...',
    currentChat:'This dialogue',
    evalTip:'Are you satisfied with our service?',
    scanDjiWechat:'Sweep the two-dimensional code with WeChat contact service',
    overLength:'The length exceeds the limit',
    satisfyTip:'- Please evaluate customer service -',
    yes:'YES',
    no:'NO',
    leaveToChatTip:'There is a customer service online, do you need access to dialogue?',
    leaveToLeaveTip:'Customer service is offline, do you need to continue message?',
    leaveToChatBtn:'Zugang Dialog',
    leaveToLeaveBtn:'Um einen Kommentar',
    leaveMsgTitle:'Message content',
    staffLeave:'Give you a message',
    viewAll:'Click to view all',
    downloadSourceImg:'View the original image',
    uploadSameFile:'Have you sent this file and sent it again?',
    hasSelected:'Already selected',
    robotToStaff:'Artificial services',
    robotPlaceholder:'Please describe your problem in one sentence, as short as possible',
    inputLengthTip1:'You can also enter',
    inputLengthTip2:'words',
    disablePlaceholder:'Current status does not support input...',
    solvedReason:'Resolved cause',
    unsolvedReason:'Unresolved cause'
};

if(typeof module!='undefined' && module.exports){
    module.exports = lanRes;
}
/**todo 多语言处理*/
(function () {
    function contentLoaded(win, fn) {
        var done = false, top = true,

            doc = win.document,
            root = doc.documentElement,
            modern = doc.addEventListener,

            add = modern ? 'addEventListener' : 'attachEvent',
            rem = modern ? 'removeEventListener' : 'detachEvent',
            pre = modern ? '' : 'on',

            init = function(e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call();//win, e.type || e
            },

            poll = function() {
                try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call();//win, 'lazy'
        else {
            if (!modern && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    }

    function replaceHtmlLan(res) {
        res = res || lanRes;
        var body = document.body || document.getElementsByTagName('body')[0];
        translater(body);
        function translater(node) {
            if (!node || !node.getAttribute) return;

            var attr = node.getAttribute('langs');
            if (attr && res[attr]) {
                if (res[attr].constructor == String) {
                    node.innerHTML = res[attr];
                } else {
                    //处理可能的需要的多语言标签属性
                    for (var e in res[attr]) {
                        if (res[attr][e] && node.getAttribute(e)) {
                            node.setAttribute(e, res[attr][e]);
                        }
                    }
                }
            }

            var children = node.childNodes;
            for (var i = 0; i < children.length; i++) {
                translater(children[i]);
            }
        }
    }
    contentLoaded(window,replaceHtmlLan);
    window.replaceLanRes = function (res) {
        if (!res || !EChatQuery || typeof res != 'object') {//ws返回资源和console的调用资源的时候 页面都应该加载好了
            return;
        }
        replaceHtmlLan(res);
        lanRes = EChatQuery.extend(lanRes, res);
    }
})();