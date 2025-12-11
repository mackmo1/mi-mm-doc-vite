import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const testAPI = async () => {
    console.log('🧪 Testing PostgreSQL API endpoints...\n');
    
    const branches = ['branches1', 'branches2', 'branches3', 'branches4', 'branches5'];
    
    for (const branch of branches) {
        console.log(`\n📋 Testing ${branch}:`);
        
        try {
            // Test GET all
            const getAllResponse = await axios.get(`${API_BASE}/${branch}`);
            console.log(`✅ GET /${branch} - ${getAllResponse.data.length} records`);
            
            // Test POST (create)
            const createData = {
                branch_id: 1,
                title: `Test ${branch} Title`,
                content: `<h1>Test content for ${branch}</h1>`,
                isShow: true,
                isAdd: false
            };
            
            const createResponse = await axios.post(`${API_BASE}/${branch}`, createData);
            console.log(`✅ POST /${branch} - Created ID: ${createResponse.data.id}`);
            
            const newId = createResponse.data.id;
            
            // Test GET by ID
            const getByIdResponse = await axios.get(`${API_BASE}/${branch}/${newId}`);
            console.log(`✅ GET /${branch}/${newId} - Found: ${getByIdResponse.data.title}`);
            
            // Test PATCH (update)
            const updateData = {
                title: `Updated ${branch} Title`,
                content: `<h1>Updated content for ${branch}</h1>`
            };
            
            const updateResponse = await axios.patch(`${API_BASE}/${branch}/${newId}`, updateData);
            console.log(`✅ PATCH /${branch}/${newId} - Updated: ${updateResponse.data.title}`);
            
            // Test DELETE
            await axios.delete(`${API_BASE}/${branch}/${newId}`);
            console.log(`✅ DELETE /${branch}/${newId} - Deleted successfully`);
            
        } catch (error) {
            console.error(`❌ Error testing ${branch}:`, error.response?.data || error.message);
        }
    }
    
    console.log('\n🎉 API testing completed!');
};

// Run tests
testAPI().catch(console.error);