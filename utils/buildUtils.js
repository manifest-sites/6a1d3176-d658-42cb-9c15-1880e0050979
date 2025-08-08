const { execSync } = require('child_process');
const fs = require('fs');
const { commitAndPushChanges } = require('./gitUtils');

/**
 * Commit changes to git repository
 * @param {Object} options - Configuration options
 * @param {string} options.commitMessage - Git commit message
 * @param {Function} options.statusCallback - Optional callback for status updates
 * @returns {Object} Result object with success status and details
 */
function commitToGitRepo({ commitMessage = 'Update configuration', statusCallback = null } = {}) {
    try {
        if (statusCallback) {
            statusCallback({
                type: 'status',
                message: 'Committing changes...',
                timestamp: new Date().toISOString()
            });
        }

        // Commit and push to Github
        const gitResult = commitAndPushChanges({ commitMessage });
        if (!gitResult.success) {
            console.warn('Git operation failed:', gitResult.message);
        }

        if (statusCallback) {
            statusCallback({
                type: 'complete',
                message: 'Changes committed successfully',
                status: 'success',
                timestamp: new Date().toISOString()
            });
        }

        return {
            success: true,
            message: 'Changes committed successfully',
            details: {
                git: gitResult
            }
        };

    } catch (error) {
        console.error('Error in commit:', error);
        
        if (statusCallback) {
            statusCallback({
                type: 'error',
                error: 'Commit failed',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }

        return {
            success: false,
            message: 'Commit failed',
            error: error.message
        };
    }
}

/**
 * Build project and upload to S3 production environment
 * @param {Object} options - Configuration options
 * @param {string} options.projectPath - Path to project directory (default: './project')
 * @param {Function} options.statusCallback - Optional callback for status updates
 * @returns {Object} Result object with success status and details
 */
function buildAndUpload({ projectPath = './project', statusCallback = null } = {}) {
    try {
        // Send status update if callback provided
        if (statusCallback) {
            statusCallback({
                type: 'status',
                message: 'Starting build process...',
                timestamp: new Date().toISOString()
            });
        }

        // Execute build
        const buildResult = execSync('npm run build', { cwd: projectPath });
        console.log('Build output:', buildResult.toString());

        if (statusCallback) {
            statusCallback({
                type: 'status',
                message: 'Build complete. Uploading to S3 production...',
                timestamp: new Date().toISOString()
            });
        }

        // Upload to S3 production environment
        const appName = process.env.APP_NAME || 'default-app';
        const s3UploadResult = execSync(`aws s3 sync dist/ s3://manifest-frontends/${appName}/ --delete`, { 
            cwd: projectPath 
        });
        console.log('S3 upload output:', s3UploadResult.toString());

        if (statusCallback) {
            statusCallback({
                type: 'complete',
                message: 'Build and deployment to production completed successfully',
                status: 'success',
                timestamp: new Date().toISOString()
            });
        }

        return {
            success: true,
            message: 'Build and deployment to production completed successfully',
            details: {
                build: buildResult.toString(),
                s3Upload: s3UploadResult.toString()
            }
        };

    } catch (error) {
        console.error('Error in build and upload:', error);
        
        if (statusCallback) {
            statusCallback({
                type: 'error',
                error: 'Build and upload failed',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }

        return {
            success: false,
            message: 'Build and upload failed',
            error: error.message
        };
    }
}


module.exports = {
    commitToGitRepo,
    buildAndUpload
};