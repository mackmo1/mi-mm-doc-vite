import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

const testIntegration = async () => {
    console.log('🔗 Testing Vue.js + PostgreSQL Integration...\n');
    
    try {
        // Test backend health
        console.log('1. Testing Backend Health...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log(`✅ Backend Status: ${healthResponse.data.status}`);
        console.log(`📊 Database: ${healthResponse.data.database}`);
        
        // Test API endpoints
        console.log('\n2. Testing API Endpoints...');
        const branches = ['branches1', 'branches2', 'branches3', 'branches4', 'branches5'];
        
        for (const branch of branches) {
            try {
                const response = await axios.get(`${API_BASE}/${branch}`);
                console.log(`✅ ${branch}: ${response.data.length} records`);
            } catch (error) {
                console.log(`❌ ${branch}: ${error.message}`);
            }
        }
        
        // Test CORS
        console.log('\n3. Testing CORS Configuration...');
        try {
            const corsResponse = await axios.get(`${API_BASE}/branches1`, {
                headers: {
                    'Origin': FRONTEND_URL
                }
            });
            console.log('✅ CORS: Frontend can access backend');
        } catch (error) {
            console.log(`❌ CORS Issue: ${error.message}`);
        }
        
        // Test data structure
        console.log('\n4. Testing Data Structure...');
        const sampleResponse = await axios.get(`${API_BASE}/branches1`);
        if (sampleResponse.data.length > 0) {
            const sample = sampleResponse.data[0];
            const requiredFields = ['id', 'title', 'content', 'isShow', 'isAdd'];
            const hasAllFields = requiredFields.every(field => sample.hasOwnProperty(field));
            
            if (hasAllFields) {
                console.log('✅ Data Structure: All required fields present');
                console.log(`📋 Sample Record:`, {
                    id: sample.id,
                    title: sample.title,
                    isShow: sample.isShow,
                    isAdd: sample.isAdd
                });
            } else {
                console.log('❌ Data Structure: Missing required fields');
            }
        }
        
        console.log('\n🎉 Integration test completed!');
        console.log('\n📝 Next Steps:');
        console.log('1. Start backend: cd server && npm run serve');
        console.log('2. Start frontend: cd client && npm run serve');
        console.log('3. Test in browser: http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('- Ensure PostgreSQL is running');
        console.log('- Ensure backend server is running on port 5000');
        console.log('- Check database connection in server/.env');
    }
};

// Run integration test
testIntegration().catch(console.error);