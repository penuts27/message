import { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import './MessageBoard.css'

const API_ENDPOINT = 'https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc'
const API_COMMENT = 'https://student-json-api.lidemy.me/comments'

const MessageBoardContainer = styled.div`
    max-width: 300px;
    width: 100%;
    margin: 0 auto;
`;
const Title = styled.h1`
    color: #333;
`;
const MessageForm = styled.form`
    margin-top: 16px;
`
const MessageTextarea = styled.textarea`
    display: block;
    width: 100%;
`
const SubmitButton = styled.button`
    margin-top: 8px;
`
const MessageList = styled.div`
    margin-top: 16px;
`

const ErrorMessage = styled.div`
    margin-top: 16px;
    color:red;
`
// 以下搬移
const MessageContainer = styled.div`
    padding: 8px 16px;
    border: 1px solid #000;
    border-radius: 8px;

    & + &{
        margin-top: 8px;
    }
`
const Loading = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,.5);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
`
const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0,0,0,.4);
`
const MessageAuthor = styled.div`
    font-size: 14px;
    color: #000;
`
const MessageTime = styled.div`
    font-size: 14px;
    color: #000;
`
const MessageBody = styled.div`
    font-size: 16px;
    margin-top: 16px;
    word-break: break-word;
`

const Message = ({author,time,children}) => {
    return (
        <MessageContainer>
            <MessageHeader>
                <MessageAuthor>{author}</MessageAuthor>
                <MessageTime>{time}</MessageTime>
            </MessageHeader>
            <MessageBody>
                {children}
            </MessageBody>
        </MessageContainer>
    )
}
Message.propTypes = {
    author: PropTypes.string,
    time: PropTypes.string,
    children: PropTypes.node
}

const MessageBoard = () => {
    const [messages,setMessages] = useState(null)
    const [messageApiError,setMessageApiError] = useState(null)
    const [textareaValue, setTextareaValue] = useState('')
    const [postMessageError, setPostMessageError] = useState(null)
    const [isLoadingPostMessage, setIsLoadingPostMessage] = useState(false)
    // console.log(isLoadingPostMessage)
    useEffect(() => {
        fetchMessage()
    })
    const fetchMessage = () => {
        fetch(API_ENDPOINT)
        .then(res=>res.json())
        .then(data => setMessages(data))
        .catch(err => setMessageApiError(err.message))
    }
    const handleTextareaChange = (e) => {
        setTextareaValue(e.target.value)
    }
    const handleTextareaFocus = () => {
        setPostMessageError(null)
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        if(isLoadingPostMessage) return
        // 發api之前更改狀態
        setIsLoadingPostMessage(true)
        // console.log(isLoadingPostMessage)
        fetch(API_COMMENT, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                nickname: 'Penuts27',
                body: textareaValue
            })
          })
          .then(res => res.json())
          .then(data => {
            setIsLoadingPostMessage(false)
              if(data.ok===0) {
                setPostMessageError(data.message)
                return
            } 
              setTextareaValue('')
              fetchMessage()
          })
          .catch(err => {
            setIsLoadingPostMessage(false)
            setPostMessageError(err.message)
          })
    }

    return (
        <MessageBoardContainer>
            {isLoadingPostMessage && <Loading>Loading...</Loading>}
            <Title>留言板</Title>
            <MessageForm onSubmit={handleFormSubmit}>
                <MessageTextarea 
                onChange={handleTextareaChange}
                onFocus={handleTextareaFocus}
                value={textareaValue}
                rows={10}/>
                <SubmitButton>送出留言</SubmitButton>
            </MessageForm>
                {
                    postMessageError && (
                        <ErrorMessage>
                         {postMessageError}
                        </ErrorMessage>
                    )
                }
                {
                    messages && messages.length === 0 && <div>no message</div> 
                }
            <MessageList>
                {messageApiError && (
                    <ErrorMessage>
                        something went wrong. {messageApiError}
                    </ErrorMessage>
                )}
                {
                    messages && messages.map(message => 
                    <Message 
                    key={message.id} 
                    author={message.nickname} 
                    time={new Date(message.createdAt).toLocaleString()}>
                    {message.body}</Message>)
                }
            </MessageList>
        </MessageBoardContainer>
    )
}
export default MessageBoard