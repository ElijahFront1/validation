import React, { useEffect } from 'react';
import { Modal, Form } from "react-bootstrap";
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import './authModal.scss'
import { signUp } from '../../api/api';
import RegularBtn from '../regularBtn/RegularBtn';

const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLength, setMinLengthError] = useState(false);
    const [latinAndNumber, setLatinAndNumber] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(false);
    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
                    break;
                case 'isEmpty':
                    value ? setEmpty(false) : setEmpty(true)
                    break;
                case 'latinAndNumber':
                    const latinAndNumberRe = /^[A-Za-z0-9]*$/i
                    latinAndNumberRe.test(String(value).toLowerCase()) ? setLatinAndNumber(false) : setLatinAndNumber(true)
                    break;
                case 'phoneNumber':
                    const phoneNumberRe = /^([+]?[0-9\s-]{0,14})*$/i
                    phoneNumberRe.test(String(value)) ? setPhoneNumber(false) : setPhoneNumber(true)
                    break;
                default:
            }
        }
    }, [value, validations]);

    useEffect(() => {
        // console.log(isEmpty, '1');
        // console.log(minLength, '2');
        // console.log(latinAndNumber, '3');
        // console.log(phoneNumber, '4');
        if (isEmpty || minLength || latinAndNumber || phoneNumber) {
            setInputValid(false)
        } else {
            setInputValid(true)
        }
    }, [isEmpty, minLength, latinAndNumber, phoneNumber]);

    return {
        isEmpty,
        minLength,
        latinAndNumber,
        phoneNumber,
        inputValid,
    }
}

const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue);
    const valid = useValidation(value, validations)

    const onChange = (e) => {
        setValue(e.target.value)
    }

    // const onBlur = (e) => {
    //     setDirty(true)
    // }

    return {
        value,
        onChange,
        ...valid
    }
}

const SignUp = ({ show, onHide }) => {
    const login = useInput('', { isEmpty: true, minLength: 4, latinAndNumber: true });
    const userName = useInput('', { isEmpty: true });
    const userLastName = useInput('', { isEmpty: true });
    const userBirthDay = useInput('', { isEmpty: true });
    const password = useInput('', { isEmpty: true, minLength: 6, latinAndNumber: true });
    const city = useInput('', { isEmpty: true });
    const phone = useInput('', { isEmpty: true, phoneNumber: true });

    const SignUpReq = async (args) => {
        try {
            await signUp(args)
        } catch (e) {
            alert(e)
        }
    }

    const signUpHandler = (...args) => {
        SignUpReq(args)
        onHide()
    }

    return (
        <Modal className="auth-modal" show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>Регистрация</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ fontSize: '.8rem', lineHeight: '1.7rem', }}>
                    <div>
                        <div>Логин</div>
                        {login.minLength && <div style={{ lineHeight: '1.7rem', }}>Длинна не менее 4 символов <ExclamationCircleFill fill="red" /></div>}
                        {login.latinAndNumber && <div style={{ lineHeight: '1.7rem', }}>Только латинские буквы и цифры <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <input
                        placeholder=""
                        value={login.value}
                        onChange={e => login.onChange(e)}
                    />
                    <div>
                        <div>Имя</div>
                        {userName.isEmpty && <div style={{ lineHeight: '1.7rem', }}>Обязательно для заполнения <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <input
                        placeholder=""
                        value={userName.value}
                        onChange={e => userName.onChange(e)} />
                    <div>
                        <div>Фамилмя</div>
                        {userLastName.isEmpty && <div style={{ lineHeight: '1.7rem', }}>Обязательно для заполнения <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <input
                        placeholder=""
                        value={userLastName.value}
                        onChange={e => userLastName.onChange(e)} />
                    <div>
                        <div>Дата вашего рождения</div>
                        {userBirthDay.isEmpty && <div style={{ lineHeight: '1.7rem', }}>Обязательно для заполнения <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <Form.Control
                        type="date"
                        name='date_of_birth'
                        value={userBirthDay.value}
                        onChange={e => userBirthDay.onChange(e)} />
                    <div>
                        <div>Пароль</div>
                        {password.minLength && <div style={{ lineHeight: '1.7rem', }}>Длинна не менее 6 символов <ExclamationCircleFill fill="red" /></div>}
                        {password.latinAndNumber && <div style={{ lineHeight: '1.7rem', }}>Только латинские буквы и цифры <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <input
                        placeholder=""
                        value={password.value}
                        onChange={e => password.onChange(e)} />
                    <div>
                        <div>Ваш город</div>
                        {city.isEmpty && <div style={{ lineHeight: '1.7rem', }}>Обязательно для заполнения <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <input
                        placeholder=""
                        value={city.value}
                        onChange={e => city.onChange(e)} />
                    <div>
                        <div>Номер мобильного телефона</div>
                        {phone.phoneNumber && <span style={{ lineHeight: '1.7rem', }}>Только цифры <ExclamationCircleFill fill="red" /></span>}
                        {phone.isEmpty && <div style={{ lineHeight: '1.7rem', }}>Обязательно для заполнения <ExclamationCircleFill fill="red" /></div>}
                    </div>
                    <input
                        placeholder=""
                        value={phone.value}
                        onChange={e => phone.onChange(e)} />
                </div >
                <RegularBtn onoff={!login.inputValid || !password.inputValid || !phone.inputValid} t={'Зарегистрироваться'} onClick={() => signUpHandler(
                    login,
                    password,
                    userName,
                    userLastName,
                    userBirthDay,
                    city,
                    phone,
                )} />
                <RegularBtn t={'Отмена'} bc={'rgb(125, 125, 125)'} c={'white'} onClick={() => onHide()} />
            </Modal.Body >
        </Modal >
    );
};

export default SignUp;