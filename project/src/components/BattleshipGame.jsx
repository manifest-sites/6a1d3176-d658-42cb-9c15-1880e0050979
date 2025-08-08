import { useState, useEffect } from 'react'
import { Button, Input, Modal, Card, Space, Typography, Row, Col, message } from 'antd'
import { Game } from '../entities/Game'

const { Title, Text } = Typography

// Ship types and sizes
const SHIPS = [
  { name: 'Carrier', size: 5, count: 1 },
  { name: 'Battleship', size: 4, count: 1 },
  { name: 'Cruiser', size: 3, count: 1 },
  { name: 'Submarine', size: 3, count: 1 },
  { name: 'Destroyer', size: 2, count: 1 }
]

const BOARD_SIZE = 10

function BattleshipGame() {
  const [gameState, setGameState] = useState('menu') // menu, create, join, setup, playing
  const [games, setGames] = useState([])
  const [currentGame, setCurrentGame] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [gameId, setGameId] = useState('')
  const [myBoard, setMyBoard] = useState(createEmptyBoard())
  const [enemyBoard, setEnemyBoard] = useState(createEmptyBoard())
  const [placingShips, setPlacingShips] = useState(true)
  const [currentShip, setCurrentShip] = useState(0)
  const [shipDirection, setShipDirection] = useState('horizontal')
  const [myTurn, setMyTurn] = useState(false)
  const [playerNumber, setPlayerNumber] = useState(null)

  function createEmptyBoard() {
    return Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0))
  }

  function generateGameId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const loadAvailableGames = async () => {
    try {
      const response = await Game.list()
      if (response.success) {
        const availableGames = response.data.filter(game => 
          game.gameStatus === 'waiting' || game.gameStatus === 'setup'
        )
        setGames(availableGames)
      }
    } catch (error) {
      message.error('Failed to load games')
    }
  }

  const createGame = async () => {
    if (!playerName.trim()) {
      message.error('Please enter your name')
      return
    }

    const newGameId = generateGameId()
    const gameData = {
      gameId: newGameId,
      player1: playerName,
      player2: null,
      currentPlayer: 1,
      gameStatus: 'waiting',
      player1Board: { ships: [], hits: [], misses: [] },
      player2Board: { ships: [], hits: [], misses: [] },
      player1Attacks: [],
      player2Attacks: []
    }

    try {
      const response = await Game.create(gameData)
      if (response.success) {
        setCurrentGame(response.data)
        setPlayerNumber(1)
        setGameState('setup')
        message.success(`Game created with ID: ${newGameId}`)
      }
    } catch (error) {
      message.error('Failed to create game')
    }
  }

  const joinGame = async (game) => {
    if (!playerName.trim()) {
      message.error('Please enter your name')
      return
    }

    try {
      const response = await Game.update(game._id, {
        player2: playerName,
        gameStatus: 'setup'
      })
      if (response.success) {
        setCurrentGame(response.data)
        setPlayerNumber(2)
        setGameState('setup')
        message.success('Joined game successfully')
      }
    } catch (error) {
      message.error('Failed to join game')
    }
  }

  const canPlaceShip = (row, col, size, direction, board) => {
    if (direction === 'horizontal') {
      if (col + size > BOARD_SIZE) return false
      for (let i = 0; i < size; i++) {
        if (board[row][col + i] !== 0) return false
      }
    } else {
      if (row + size > BOARD_SIZE) return false
      for (let i = 0; i < size; i++) {
        if (board[row + i][col] !== 0) return false
      }
    }
    return true
  }

  const placeShip = (row, col) => {
    if (currentShip >= SHIPS.length) return
    
    const ship = SHIPS[currentShip]
    if (!canPlaceShip(row, col, ship.size, shipDirection, myBoard)) {
      message.error('Cannot place ship here')
      return
    }

    const newBoard = [...myBoard]
    const newShips = currentGame[`player${playerNumber}Board`].ships || []
    
    const shipPositions = []
    for (let i = 0; i < ship.size; i++) {
      const r = shipDirection === 'horizontal' ? row : row + i
      const c = shipDirection === 'horizontal' ? col + i : col
      newBoard[r][c] = 1
      shipPositions.push([r, c])
    }

    newShips.push({
      name: ship.name,
      positions: shipPositions,
      hits: 0
    })

    setMyBoard(newBoard)
    setCurrentShip(currentShip + 1)

    // Update game in database
    updateGameBoard(newShips)

    if (currentShip + 1 >= SHIPS.length) {
      setPlacingShips(false)
      message.success('All ships placed! Waiting for opponent...')
    }
  }

  const updateGameBoard = async (ships) => {
    const boardKey = `player${playerNumber}Board`
    const updateData = {
      [boardKey]: {
        ...currentGame[boardKey],
        ships: ships
      }
    }

    // Check if both players are ready
    const otherPlayer = playerNumber === 1 ? 2 : 1
    const otherPlayerShips = currentGame[`player${otherPlayer}Board`]?.ships || []
    
    if (ships.length >= SHIPS.length && otherPlayerShips.length >= SHIPS.length) {
      updateData.gameStatus = 'playing'
      updateData.currentPlayer = 1
    }

    try {
      const response = await Game.update(currentGame._id, updateData)
      if (response.success) {
        setCurrentGame(response.data)
        if (response.data.gameStatus === 'playing') {
          setGameState('playing')
          setMyTurn(playerNumber === response.data.currentPlayer)
        }
      }
    } catch (error) {
      message.error('Failed to update game')
    }
  }

  const makeAttack = async (row, col) => {
    if (!myTurn) {
      message.error('Not your turn')
      return
    }

    const attackKey = `player${playerNumber}Attacks`
    const currentAttacks = currentGame[attackKey] || []
    
    // Check if already attacked this position
    if (currentAttacks.some(attack => attack[0] === row && attack[1] === col)) {
      message.error('Already attacked this position')
      return
    }

    const newAttacks = [...currentAttacks, [row, col]]
    const otherPlayer = playerNumber === 1 ? 2 : 1
    const otherPlayerBoard = currentGame[`player${otherPlayer}Board`]
    
    // Check if it's a hit
    let isHit = false
    let sunkShip = null
    
    if (otherPlayerBoard && otherPlayerBoard.ships) {
      otherPlayerBoard.ships.forEach(ship => {
        ship.positions.forEach(pos => {
          if (pos[0] === row && pos[1] === col) {
            isHit = true
            ship.hits = (ship.hits || 0) + 1
            if (ship.hits >= ship.positions.length) {
              sunkShip = ship.name
            }
          }
        })
      })
    }

    // Update enemy board display
    const newEnemyBoard = [...enemyBoard]
    newEnemyBoard[row][col] = isHit ? 2 : 3 // 2 = hit, 3 = miss

    setEnemyBoard(newEnemyBoard)

    // Check for win condition
    let winner = null
    if (otherPlayerBoard && otherPlayerBoard.ships) {
      const allSunk = otherPlayerBoard.ships.every(ship => 
        ship.hits >= ship.positions.length
      )
      if (allSunk) {
        winner = `player${playerNumber}`
      }
    }

    // Update game state
    const updateData = {
      [attackKey]: newAttacks,
      currentPlayer: winner ? null : otherPlayer,
      gameStatus: winner ? 'finished' : 'playing',
      winner: winner ? `Player ${playerNumber}` : null,
      [`player${otherPlayer}Board`]: otherPlayerBoard
    }

    try {
      const response = await Game.update(currentGame._id, updateData)
      if (response.success) {
        setCurrentGame(response.data)
        setMyTurn(!winner && otherPlayer === playerNumber)
        
        if (isHit) {
          message.success(sunkShip ? `Hit! You sunk the ${sunkShip}!` : 'Hit!')
        } else {
          message.info('Miss!')
        }
        
        if (winner) {
          message.success('You won!')
        }
      }
    } catch (error) {
      message.error('Failed to make attack')
    }
  }

  // Poll for game updates
  useEffect(() => {
    if (currentGame && gameState !== 'menu') {
      const interval = setInterval(async () => {
        try {
          const response = await Game.get(currentGame._id)
          if (response.success) {
            setCurrentGame(response.data)
            
            if (response.data.gameStatus === 'playing') {
              setGameState('playing')
              setMyTurn(playerNumber === response.data.currentPlayer)
              
              // Update enemy attacks on my board
              const enemyAttacks = response.data[`player${playerNumber === 1 ? 2 : 1}Attacks`] || []
              const newMyBoard = [...myBoard]
              enemyAttacks.forEach(([row, col]) => {
                if (myBoard[row][col] === 1) {
                  newMyBoard[row][col] = 2 // hit
                } else if (myBoard[row][col] === 0) {
                  newMyBoard[row][col] = 3 // miss
                }
              })
              setMyBoard(newMyBoard)
            }
            
            if (response.data.gameStatus === 'finished') {
              const won = response.data.winner === `Player ${playerNumber}`
              message[won ? 'success' : 'error'](won ? 'You won!' : 'You lost!')
            }
          }
        } catch (error) {
          console.error('Failed to update game state')
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [currentGame, gameState, playerNumber, myBoard])

  const renderCell = (row, col, isMyBoard, board) => {
    const cellValue = board[row][col]
    let className = 'w-8 h-8 border border-gray-400 cursor-pointer flex items-center justify-center text-xs font-bold '
    
    if (cellValue === 0) {
      className += 'bg-blue-100 hover:bg-blue-200' // water
    } else if (cellValue === 1) {
      className += isMyBoard ? 'bg-gray-600 text-white' : 'bg-blue-100 hover:bg-blue-200' // ship (hidden on enemy board)
    } else if (cellValue === 2) {
      className += 'bg-red-500 text-white' // hit
    } else if (cellValue === 3) {
      className += 'bg-gray-300' // miss
    }

    if (placingShips && isMyBoard) {
      className += ' hover:bg-green-200'
    } else if (!isMyBoard && myTurn && gameState === 'playing') {
      className += ' hover:bg-red-200'
    }

    const onClick = () => {
      if (placingShips && isMyBoard) {
        placeShip(row, col)
      } else if (!isMyBoard && myTurn && gameState === 'playing') {
        makeAttack(row, col)
      }
    }

    return (
      <div key={`${row}-${col}`} className={className} onClick={onClick}>
        {cellValue === 2 ? 'X' : cellValue === 3 ? '·' : ''}
      </div>
    )
  }

  const renderBoard = (board, isMyBoard, title) => (
    <Card title={title} className="w-full max-w-md">
      <div className="grid grid-cols-10 gap-0 mb-4">
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => renderCell(rowIndex, colIndex, isMyBoard, board))
        )}
      </div>
    </Card>
  )

  if (gameState === 'menu') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Title level={2} className="text-center mb-6">Battleship Game</Title>
        
        <Card className="mb-4">
          <Space direction="vertical" className="w-full">
            <Input 
              placeholder="Enter your name" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              size="large"
            />
            <Space className="w-full justify-center">
              <Button type="primary" size="large" onClick={createGame}>
                Create New Game
              </Button>
              <Button size="large" onClick={() => {setGameState('join'); loadAvailableGames()}}>
                Join Game
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    )
  }

  if (gameState === 'join') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Title level={2} className="text-center mb-6">Join a Game</Title>
        
        <div className="mb-4">
          <Button onClick={() => setGameState('menu')} className="mb-4">← Back</Button>
          <Button onClick={loadAvailableGames} className="mb-4 ml-2">Refresh</Button>
        </div>

        {games.length === 0 ? (
          <Card>
            <Text>No games available. Create a new game!</Text>
          </Card>
        ) : (
          <Space direction="vertical" className="w-full">
            {games.map(game => (
              <Card key={game._id} className="w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Game ID: {game.gameId}</Text><br/>
                    <Text>Host: {game.player1}</Text><br/>
                    <Text type="secondary">Status: {game.gameStatus}</Text>
                  </div>
                  <Button type="primary" onClick={() => joinGame(game)}>
                    Join Game
                  </Button>
                </div>
              </Card>
            ))}
          </Space>
        )}
      </div>
    )
  }

  if (gameState === 'setup') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Title level={2} className="text-center mb-6">
          Setup Your Ships - Game ID: {currentGame?.gameId}
        </Title>
        
        {placingShips && (
          <div className="text-center mb-4">
            <Text strong>
              Place your {SHIPS[currentShip]?.name} (Size: {SHIPS[currentShip]?.size})
            </Text>
            <div className="mt-2">
              <Button 
                type={shipDirection === 'horizontal' ? 'primary' : 'default'}
                onClick={() => setShipDirection('horizontal')}
                className="mr-2"
              >
                Horizontal
              </Button>
              <Button 
                type={shipDirection === 'vertical' ? 'primary' : 'default'}
                onClick={() => setShipDirection('vertical')}
              >
                Vertical
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          {renderBoard(myBoard, true, "Your Board")}
        </div>

        {!placingShips && (
          <div className="text-center mt-4">
            <Text>Ships placed! Waiting for opponent to finish setup...</Text>
          </div>
        )}
      </div>
    )
  }

  if (gameState === 'playing') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Title level={2} className="text-center mb-4">
          Battleship - Game ID: {currentGame?.gameId}
        </Title>
        
        <div className="text-center mb-6">
          <Text strong className={myTurn ? 'text-green-600' : 'text-red-600'}>
            {myTurn ? 'Your Turn - Click on enemy board to attack!' : 'Opponent\'s Turn'}
          </Text>
        </div>

        <Row gutter={16} justify="center">
          <Col>
            {renderBoard(myBoard, true, "Your Board")}
          </Col>
          <Col>
            {renderBoard(enemyBoard, false, "Enemy Board")}
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button onClick={() => {setGameState('menu'); setCurrentGame(null)}}>
            Leave Game
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default BattleshipGame