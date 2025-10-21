// import { Link } from "@tanstack/react-router";
// import { Typography, Paper, Alert, Button, Box, Container } from "../../bfg-ui";

// interface ILobbyReadyComponentProps {
//   createdLobbyId: string;
//   // copyJoinLink: () => void;
//   // copySuccess: string;
//   // form: any;
// }

// export const LobbyReadyComponent = ({
//   createdLobbyId,
//   // copyJoinLink,
//   // copySuccess,
//   // form,
// }: ILobbyReadyComponentProps) => {
//   return (
//     <Container maxWidth="md" style={{ paddingTop: 32, paddingBottom: 32 }}>
//       <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
//         Host a Lobby
//       </Typography>
      
//       <Paper elevation={2} style={{ padding: 24 }}>
//       <Alert severity="success" style={{ marginBottom: 24 }}>
//         <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//           <Typography variant="h6" gutterBottom>
//             Lobby Created Successfully!
//           </Typography>
//           <Typography variant="body2" style={{ marginBottom: 16 }}>
//             Your lobby has been created and is ready for players to join.
//           </Typography>
//           <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
//             <Link
//               to="/hosted-lobby/$lobbyId"
//               params={{ lobbyId: createdLobbyId }}
//               style={{ textDecoration: 'none' }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//               >
//                 Go to Hosted Lobby
//               </Button>
//             </Link>
//           </Box>
//         </Box>
//             {/* <Link
//               to="/join-lobby/$lobbyId"
//               params={{ lobbyId: createdLobbyId }}
//               style={{ textDecoration: 'none' }}
//             >
//               <Button
//                 variant="contained"
//                 color="warning"
//               >
//                 Go to Player Lobby
//               </Button>
//             </Link>
//             <Button
//               onClick={copyJoinLink}
//               variant="contained"
//               color="secondary"
//             >
//               Copy Join Link
//             </Button> */}
//           {/* {copySuccess && (
//             <Chip 
//               label={copySuccess} 
//               color="success" 
//               size="small" 
//               style={{ marginTop: 16 }} 
//             />
//           )} */}
//         </Alert>
        
//         {/* <Box style={{ marginTop: 24 }}>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={() => {
//               setCreatedLobbyId(null);
//               setCopySuccess('');
//               form.reset();
//             }}
//           >
//             Create Another Lobby
//           </Button>
//         </Box> */}
//       </Paper>
//     </Container>
//   );
// }
