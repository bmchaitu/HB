import './styles/App.css';
import React, { useState, useEffect } from "react";
import Input from '@mui/material/Input';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import {Button} from "@mui/material";

import { createTheme, ThemeProvider } from '@mui/material/styles';

const PERSONS = 'persons';

const theme = createTheme({
    palette: {
        neutral: {
            main: '#CEC8EF',
            contrastText: '#8A2BE2FF',
        },
    },
});


function App() {
    const [persons, setPersons] = useState([]);
    const [errorValues, setErrorValues] = useState({name: false, email: false, mobile: false});
    const [inputValues, setInputValues] = useState({name: '', mobile: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const localData = localStorage.getItem(PERSONS);
        if (localData) {
            setPersons(JSON.parse(localData));
        }
    }, [])

    const handleInputChange = ({  name, value }) => {
      setInputValues(s => ({
          ...s,
          [name]: value,
      }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setLoading(true);
        const { name, mobile, email } = inputValues;
        const inputError = {name: false, mobile: false, email: false};
        if(name && mobile.match(/\d{10}/)
            && email.match(/\w+@\w+\.\w{2,3}/)) {
            setInputValues({
                name: '',
                email: '',
                mobile: '',
            });
            await localStorage.setItem(PERSONS, JSON.stringify([...persons, {...inputValues}]));
            const localPersons = localStorage.getItem(PERSONS);
            setPersons(JSON.parse(localPersons));
            setLoading(false);
            setShowToast(true);
        } else {
            if (!name) {
                inputError.name = true;
            }
            if (!mobile.match(/\d{10}/)) {
                inputError.mobile = true;
            }
            if (!email.match(/\w+@\w+\.\w{2,3}/)) {
                inputError.email = true;
            }
            setLoading(false);
        }
        setErrorValues(inputError);
    };

    const handleDelete = index => () => {
        const filteredPersons = persons.filter((p, i) => i !== index) || [];
        localStorage.setItem(PERSONS, JSON.stringify(filteredPersons));
        const localItems = localStorage.getItem(PERSONS);
        setPersons(JSON.parse(localItems));
    }

    const renderToast = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 3000);

        return (
            <div className={'center'}>
                <div className={'toast'}>
                    <text className={'toastMessage'}>SUCCESSFULLY ADDED</text>
                </div>
            </div>
        )
    }

  return (
    <ThemeProvider theme={theme}>
        <div className={'center'}>
            <div className={'app'}>
                <div className={'headerContainer'}>
                    <text className={'header'}>
                        Employee List
                    </text>
                </div>
                <div className={'line'} />
                <form className="container">
                    <div className={'inner-container'}>
                        <div>
                            <text className={'inputLabel'}>
                                Name*
                            </text>
                        </div>
                        <Input
                            color={'neutral'}
                            error={errorValues.name}
                            name='name'
                            placeholder='eg. John Doe'
                            value={inputValues.name}
                            onChange={({ target }) => handleInputChange(target)}
                        />
                        {errorValues.name && (
                            <div>
                                <text className={'helperText'}>Enter valid data*</text>
                            </div>
                        )}
                    </div>
                    <div className={'inner-container'}>
                        <Input
                            color={'neutral'}
                            inputProps={{ maxlength: 10 }}
                            error={errorValues.mobile}
                            name='mobile'
                            placeholder='Mobile*'
                            inputMode='numeric'
                            value={inputValues.mobile}
                            onChange={({ target }) => handleInputChange(target)}
                        />
                        {errorValues.mobile && (
                            <div>
                                <text className={'helperText'}>Enter valid data*</text>
                            </div>
                        )}
                    </div>
                    <div className={'inner-container'}>
                        <Input
                            color={'neutral'}
                            error={errorValues.email}
                            name='email'
                            placeholder='Email*'
                            value={inputValues.email}
                            onChange={({ target }) => handleInputChange(target)}
                        />
                        {errorValues.email && (
                            <div>
                                <text className={'helperText'}>Enter valid data*</text>
                            </div>
                        )}
                    </div>
                    <Grid container>
                        <Grid item xs={8}/>
                        <Grid item xs={4}>
                            <div className={'buttonContainer'}>
                                <LoadingButton
                                    color={'neutral'}
                                    loading={loading}
                                    variant="contained"
                                    type={'submit'}
                                    onClick={handleSubmit}
                                >
                                    Add
                                </LoadingButton>
                            </div>
                        </Grid>
                    </Grid>
                </form>
                {showToast && renderToast()}
                <div className={'center'}>
                    <div className={'persons-list'}>
                        {persons.map((person,index) => {
                            return (
                                <div key={person} className={'person'}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <div>
                                                <text className={'inputLabel'}>
                                                    Name
                                                </text>
                                            </div>
                                            <text className={'personValue'}>{person.name}</text>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <div>
                                                <text className={'inputLabel'}>
                                                    Mobile
                                                </text>
                                            </div>
                                            <text className={'personValue'}>{person.mobile}</text>
                                        </Grid>
                                    </Grid>
                                    <Grid container className={'gridContainer'}>
                                        <Grid item xs={8}>
                                            <div>
                                                <text className={'inputLabel'}>
                                                    Email.
                                                </text>
                                            </div>
                                            <text className={'personValue'}>{person.email}</text>
                                        </Grid>
                                        <Grid item xs={4} marginY={1}>
                                            <Button
                                                color={'neutral'}
                                                variant="contained"
                                                onClick={handleDelete(index)}
                                            >
                                                Delete
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    </ThemeProvider>
  );
}

export default App;
