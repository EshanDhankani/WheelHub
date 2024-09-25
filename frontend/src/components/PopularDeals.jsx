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
