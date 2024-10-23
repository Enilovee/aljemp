import React from 'react'
import { Helmet } from 'react-helmet-async'

const Meta = ({ title, description, keywords }) => {
    
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='keywords' content={keywords} />
        <meta name='description' content={description} />
    </Helmet>
  )
}

Meta.defaultProps ={
    title: "Welcome to Alarry clothier",
    description: " We sell the best classy and coporate wears",
    keywoords:"Female gowns, Female suites, Female fashion, Hottest female dresses, trending female clothing "                                  
}

export default Meta