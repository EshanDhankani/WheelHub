import { Box, Typography, Grid } from '@mui/material';

const experiences = [
  {
    image: '/bg1.png',
    heading: 'Analyze Videos',
    text: 'you can analze the videos for the cars',
  },
  {
    image: '/autopart.jpg',
    heading: 'Autoparts',
    text: 'some text about the autoparts.',
  },
  {
    image: '/mechanic4.jpg',
    heading: 'Mechanic',
    text: 'some text about the mechanic',
  },
  {
    image: '/mechanic4.jpg',
    heading: 'Mechanic',
    text: 'some text about the mechanic',
  },
];

export default function Experience() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography variant="h4" component="h4" sx={{ mb: 4, pl: 2, textAlign: 'left',fontWeight: 'bold' }}>
          Managed By WheelHub
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {experiences.map((exp, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  backgroundImage: `url(${exp.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: 400,
                  width: 270,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  color: '#fff',
                  p: 2,
                  ml: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" component="h6" sx={{ textSelf: 'flex-start', maxWidth: '70%', mb: 1, fontWeight: 'bold', fontSize: 24 }}>
                  {exp.heading}
                </Typography>
                <Typography variant="body1" component="p" sx={{fontSize: 16, textAlign: 'left',height: '40%'}}>
                  {exp.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
