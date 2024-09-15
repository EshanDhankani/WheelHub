import React from 'react';
import PropTypes from 'prop-types'; 
import { Box, Container, Grid, Tab, Tabs, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

const Root = styled(Box)({
  backgroundColor: '#f7f8fa',
  minHeight: '190vh',
  padding: '2rem 0',
});

const TabContainer = styled(Box)({
  borderBottom: '1px solid #e0e0e0',
  marginBottom: '1.5rem',
});

const CustomTab = styled(Tab)({
  minWidth: 'auto',
  marginRight: '1rem',
  textTransform: 'none',
  fontWeight: 'bold',
});

const CustomCard = styled(Card)({
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '1rem',
});

const CustomCardContent = styled(CardContent)({
  textAlign: 'center',
});

const CustomCardMedia = styled(CardMedia)({
  height: 190,
  backgroundColor: '#e0e0e0',
});

const Header = styled(Typography)({
  textAlign: 'center',
  marginBottom: '2rem',
});


 export const cars = [
  { id:1, make: 'Toyota', model: 'Vitz 2020',  price: 'PKR 6,200,000', location: 'Lahore', image: 'https://cache1.pakwheels.com/ad_pictures/1051/toyota-vitz-hybrid-f-1-5-2020-105109960.webp' },
  { id:2, make: 'Honda',  model: 'Civic 2022', price: 'PKR 79.5 Lacs', location: 'Karachi', image: 'https://cache4.pakwheels.com/ad_pictures/1045/honda-civic-oriel-2022-104549739.webp' },
  { id:3, make: 'Toyota', model: 'Yaris 2022', price: 'PKR 46.5 Lacs', location: 'Islamabad', image: 'https://cache2.pakwheels.com/ad_pictures/1056/toyota-yaris-ativ-x-cvt-1-5-2022-105681365.webp' },
  { id:4, make: 'Honda',  model: 'City 2018',  price: 'PKR 39.5 Lacs', location: 'Peshawar KPK', image: 'https://cache4.pakwheels.com/ad_pictures/1034/honda-city-aspire-prosmatec-2018-103461075.webp' },
  { id:5, make: 'Honda',  model: 'Jade 2015',  price: 'PKR 44 Lacs', location: 'Islamabad', image: 'https://cache3.pakwheels.com/ad_pictures/1038/honda-jade-hybrid-hybrid-x-2-2015-103888710.webp' },
  { id:6, make: 'Audi',   model: 'Audi e-tron GT 2022',  price: 'PKR 3.98 crore', location: 'Islamabad', image: 'https://cache1.pakwheels.com/ad_pictures/1018/audi-e-tron-gt-standard-8-2022-101882345.webp' },
  { id:7, make: 'Mercedes',model: 'Mercedes Benz E 2014', price: 'PKR 1.21 crore', location: 'Faisalabad', image: 'https://cache4.pakwheels.com/ad_pictures/1043/mercedes-benz-e-class-e-250-2014-104344092.webp' },
  { id:8, make: 'Changan', model: 'Changan Alsvin',price: 'PKR 44 Lacs', location: 'Rawalpindi', image: 'https://cache2.pakwheels.com/ad_pictures/1022/changan-alsvin-1-5l-dct-lumiere-2023-102220298.webp' },
];

const PopularDeals = ({ cars }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Root>
      <Container>
        <Header variant="h4" component="h1">
          Most popular car deals in Pakistan
        </Header>
        <Header variant="subtitle1">
          Apne pasand ki car len
        </Header>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className={TabContainer}
          indicatorColor="primary"
        >
          <CustomTab label="Popular" />
          <CustomTab label="Large Car" />
          <CustomTab label="Small Car" />
          <CustomTab label="Exclusive Car" />
        </Tabs>
        <Grid container spacing={2}>
          {cars.map((car, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
             <Box sx={{mt: 4}}> 
  
              <CustomCard>
                <CustomCardMedia
                  component="img"
                  image={car.image}
                  title={car.name}
                />
                <CustomCardContent>
                  <Typography variant="h6">{car.model}</Typography>
                  <Typography variant="body2">{car.price}</Typography>
                  <Typography variant="body2">{car.location}</Typography>
                </CustomCardContent>
              </CustomCard>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Root>
  );
};

// Add prop types validation
PopularDeals.propTypes = {
  cars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};


export default PopularDeals;
