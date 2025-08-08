import { useState, useEffect } from 'react'
import { Button, Card, Typography } from 'antd'
import { Item } from '../../entities/Item'
import manifestConfig from '../../../manifest.config.json'

const { Title } = Typography

function LoginRequired() {
    const [result, setResult] = useState('')
    const [authData, setAuthData] = useState(null)

    const handleGoogleLogin = () => {
        window.location.href = `http://localhost:3500/auth/google?appId=${manifestConfig.appId}`
    }

    const checkUser = async () => {
        try {
            const response = await fetch('http://localhost:3500/auth/user', { credentials: 'include' })
            const data = await response.json()
            setResult(JSON.stringify(data, null, 2))
            setAuthData(data)
        } catch (error) {
            setResult(`Error: ${error.message}`)
            setAuthData(null)
        }
    }

    // Load auth data on component mount
    useEffect(() => {
        checkUser()
    }, [])

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3500/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json()
            setResult(JSON.stringify(data, null, 2))
            setAuthData(null)
        } catch (error) {
            setResult(`Error: ${error.message}`)
        }
    }

    const testItemAPI = async () => {
        try {
            // First try to list all items
            const items = await Item.list()
            setResult(`Item.list() response:\n${JSON.stringify(items, null, 2)}`)
            
            // If there are items, try to get the first one
            if (items.data && items.data.length > 0) {
                const firstItemId = items.data[0]._id
                const item = await Item.get(firstItemId)
                setResult(`Item.get(${firstItemId}) response:\n${JSON.stringify(item, null, 2)}`)
            }
        } catch (error) {
            setResult(`Item API Error: ${error.message}`)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6">
            <Card>
                <Title level={2} className="text-center mb-6">Google Auth Test</Title>
                
                {/* Authentication Status */}
                <div className="mb-6 p-4 bg-blue-50 rounded">
                    <Title level={4} className="mb-2">Current Auth Status:</Title>
                    {authData ? (
                        <div className="text-green-600 font-medium">
                            ✅ Logged in as: {authData.user?.name || authData.user?.email || 'User'}
                        </div>
                    ) : (
                        <div className="text-red-600 font-medium">
                            ❌ Not logged in
                        </div>
                    )}
                </div>

                {/* Authentication Data Display */}
                {authData && (
                    <div className="mb-6">
                        <Title level={4} className="mb-2">Authentication Cookie Data:</Title>
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
                            {JSON.stringify(authData, null, 2)}
                        </pre>
                    </div>
                )}
                
                <div className="space-y-4">
                    <Button 
                        type="primary" 
                        size="large" 
                        block 
                        onClick={handleGoogleLogin}
                    >
                        Login with Google
                    </Button>

                    <Button 
                        size="large" 
                        block 
                        onClick={checkUser}
                    >
                        Check User
                    </Button>

                    <Button 
                        size="large" 
                        block 
                        onClick={logout}
                    >
                        Logout
                    </Button>

                    <Button 
                        size="large" 
                        block 
                        onClick={testItemAPI}
                        type="default"
                    >
                        Test Item API (with auth)
                    </Button>
                </div>

                {result && (
                    <div className="mt-6">
                        <Title level={5} className="mb-2">Last API Response:</Title>
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                            {result}
                        </pre>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default LoginRequired